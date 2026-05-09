"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

interface BookingRecord {
  id: string;
  service_id: string;
  customer_name: string;
  phone: string;
  booking_date: string;
  booking_time?: string | null;
  created_at: string;
}

interface ServiceRecord {
  id: string;
  name: string;
  price: number;
  duration: number;
}

const emptyService = {
  name: "",
  price: "",
  duration: "",
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [serviceForm, setServiceForm] = useState({ ...emptyService });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/admin/login";
        return;
      }
      setUser(session.user);
      setAuthLoading(false);
    };
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        window.location.href = "/admin/login";
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memuat data admin");
      }

      setBookings(data.bookings ?? []);
      setServices(data.services ?? []);
    } catch (err) {
      setError((err as Error).message || "Gagal memuat data admin.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const serviceMap = useMemo(
    () => new Map(services.map((service) => [service.id, service.name])),
    [services],
  );

  const summary = useMemo(
    () => ({
      bookingCount: bookings.length,
      serviceCount: services.length,
    }),
    [bookings.length, services.length],
  );

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm("Hapus booking ini?")) return;
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal hapus booking.");
      showNotice("Booking berhasil dihapus.");
      loadData();
    } catch (err) {
      setError((err as Error).message || "Gagal hapus booking.");
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm("Hapus service ini?")) return;
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal hapus service.");
      showNotice("Service berhasil dihapus.");
      loadData();
      if (editingServiceId === serviceId) {
        setEditingServiceId(null);
        setServiceForm({ ...emptyService });
      }
    } catch (err) {
      setError((err as Error).message || "Gagal hapus service.");
    }
  };

  const handleEditService = (service: ServiceRecord) => {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name,
      price: String(service.price),
      duration: String(service.duration),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleServiceSubmit = async () => {
    if (!serviceForm.name.trim()) return setError("Nama service wajib diisi.");
    if (!serviceForm.price.trim() || Number.isNaN(Number(serviceForm.price)))
      return setError("Harga service harus berupa angka.");
    if (
      !serviceForm.duration.trim() ||
      Number.isNaN(Number(serviceForm.duration))
    )
      return setError("Durasi service harus berupa angka.");

    setSaving(true);
    setError("");

    try {
      const method = editingServiceId ? "PATCH" : "POST";
      const url = editingServiceId
        ? `/api/admin/services/${editingServiceId}`
        : "/api/admin/services";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: serviceForm.name.trim(),
          price: Number(serviceForm.price),
          duration: Number(serviceForm.duration),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan service.");

      showNotice(
        editingServiceId
          ? "Service berhasil diperbarui."
          : "Service berhasil ditambahkan.",
      );
      setServiceForm({ ...emptyService });
      setEditingServiceId(null);
      loadData();
    } catch (err) {
      setError((err as Error).message || "Gagal menyimpan service.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    document.cookie = "admin_auth=; path=/; max-age=0";
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  if (authLoading) {
    return (
      <div className="admin-page">
        <div style={{ textAlign: "center", padding: "50px" }}>Memuat...</div>
      </div>
    );
  }

  return (
    <main id="admin" className="admin-page">
      <section className="admin-hero">
        <div>
          <span className="admin-label">Super Admin</span>
          <h1 className="admin-title">Dashboard Booking NOIR Studio</h1>
          <p className="admin-description">
            Halaman ini menampilkan booking, service, dan opsi manajemen.
            Gunakan dengan hati-hati.
          </p>
          <div className="admin-actions">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </section>

      <section className="admin-summary">
        <div className="summary-card">
          <span className="summary-number">{summary.bookingCount}</span>
          <span className="summary-label">Total Booking</span>
        </div>
        <div className="summary-card">
          <span className="summary-number">{summary.serviceCount}</span>
          <span className="summary-label">Total Service</span>
        </div>
      </section>

      {notice && <div className="admin-notice">{notice}</div>}
      {error && <div className="admin-alert">{error}</div>}

      <section className="admin-content">
        <div className="admin-columns">
          <div className="admin-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-label">Booking</span>
                <h2 className="panel-title">Daftar Booking</h2>
              </div>
              <span className="panel-meta">
                {loading ? "Memuat..." : "Terbaru"}
              </span>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Jam</th>
                    <th>Service</th>
                    <th>Nama</th>
                    <th>HP</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.booking_date}</td>
                      <td>
                        {booking.booking_time
                          ? booking.booking_time.slice(0, 5)
                          : "-"}
                      </td>
                      <td>{serviceMap.get(booking.service_id) ?? "Unknown"}</td>
                      <td>{booking.customer_name}</td>
                      <td>{booking.phone}</td>
                      <td>
                        <button
                          className="action-btn action-delete"
                          onClick={() => handleDeleteBooking(booking.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-panel admin-panel--sidebar">
            <div className="panel-heading">
              <div>
                <span className="panel-label">Service</span>
                <h2 className="panel-title">Kelola Layanan</h2>
              </div>
              <span className="panel-meta">{services.length} item</span>
            </div>

            <div className="service-form">
              <label className="field-label">Nama Service</label>
              <input
                className="field-input"
                value={serviceForm.name}
                onChange={(e) =>
                  setServiceForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Contoh: Haircut"
              />

              <label className="field-label">Harga</label>
              <input
                className="field-input"
                value={serviceForm.price}
                onChange={(e) =>
                  setServiceForm((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="Contoh: 150000"
                inputMode="numeric"
              />

              <label className="field-label">Durasi (menit)</label>
              <input
                className="field-input"
                value={serviceForm.duration}
                onChange={(e) =>
                  setServiceForm((prev) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
                placeholder="Contoh: 60"
                inputMode="numeric"
              />

              <div className="form-actions">
                {editingServiceId && (
                  <button
                    type="button"
                    className="action-btn action-cancel"
                    onClick={() => {
                      setEditingServiceId(null);
                      setServiceForm({ ...emptyService });
                      setError("");
                    }}
                  >
                    Batal
                  </button>
                )}
                <button
                  type="button"
                  className="action-btn action-save"
                  onClick={handleServiceSubmit}
                  disabled={saving}
                >
                  {editingServiceId ? "Perbarui Service" : "Tambah Service"}
                </button>
              </div>
            </div>

            <div className="service-list">
              {services.map((service) => (
                <div key={service.id} className="service-list-item">
                  <div>
                    <strong>{service.name}</strong>
                  </div>
                  <div className="service-actions">
                    <button
                      className="action-btn action-edit"
                      onClick={() => handleEditService(service)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn action-delete"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .admin-page {
          min-height: 100vh;
          padding: 48px 24px 80px;
          background: #05050a;
          color: #f5f0eb;
          font-family: 'Outfit', sans-serif;
        }

        .admin-hero {
          max-width: 920px;
          margin: 0 auto 40px;
          padding: 32px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .admin-label {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a78bfa;
          margin-bottom: 14px;
        }

        .admin-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          margin-bottom: 16px;
          line-height: 1.05;
        }

        .admin-description {
          font-size: 0.95rem;
          font-weight: 300;
          color: #9ca3af;
          line-height: 1.75;
          max-width: 720px;
        }

        .admin-actions {
          margin-top: 20px;
        }

        .logout-btn {
          border: none;
          border-radius: 8px;
          padding: 10px 16px;
          background: rgba(255,255,255,0.08);
          color: #f5f0eb;
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .logout-btn:hover {
          background: rgba(255,255,255,0.15);
        }

        .admin-summary {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          max-width: 1200px;
          margin: 0 auto 28px;
        }

        .summary-card {
          padding: 28px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
        }

        .summary-number {
          display: block;
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem;
          font-weight: 600;
          color: #f5f0eb;
          margin-bottom: 8px;
        }

        .summary-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #7c6fa0;
        }

        .admin-notice {
          max-width: 1200px;
          margin: 0 auto 18px;
          padding: 16px 18px;
          border-radius: 10px;
          background: rgba(16, 185, 129, 0.12);
          color: #a7f3d0;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .admin-alert {
          max-width: 1200px;
          margin: 0 auto 18px;
          padding: 16px 18px;
          border-radius: 10px;
          background: rgba(220, 38, 38, 0.12);
          color: #fed7d7;
          border: 1px solid rgba(248, 113, 113, 0.2);
        }

        .admin-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .admin-columns {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .admin-panel {
          padding: 28px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .admin-panel--sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .panel-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }

        .panel-label {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #7c6fa0;
          margin-bottom: 8px;
        }

        .panel-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          color: #f5f0eb;
          margin: 0;
        }

        .panel-meta {
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .admin-table-wrap {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 760px;
        }

        .admin-table th,
        .admin-table td {
          padding: 16px 18px;
          text-align: left;
          font-size: 0.92rem;
          color: #d1d5db;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .admin-table th {
          color: #f5f0eb;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: 0.75rem;
          border-bottom: 2px solid rgba(255,255,255,0.12);
        }

        .admin-table tr:hover {
          background: rgba(255,255,255,0.05);
        }

        .field-label {
          display: block;
          margin-bottom: 10px;
          color: #9ca3af;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .field-input {
          width: 100%;
          margin-bottom: 18px;
          padding: 12px 14px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: #f5f0eb;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .field-input:focus {
          border-color: rgba(167,139,250,0.5);
        }

        .field-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          flex-wrap: wrap;
        }

        .service-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .service-list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 16px 18px;
          border-radius: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .service-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .action-btn {
          border: none;
          border-radius: 8px;
          padding: 10px 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .action-save {
          color: #0f172a;
          background: #a78bfa;
        }

        .action-cancel {
          color: #f5f0eb;
          background: rgba(255,255,255,0.08);
        }

        .action-edit {
          color: #f8fafc;
          background: rgba(96,165,250,0.2);
        }

        .action-delete {
          color: #f8fafc;
          background: rgba(248,113,113,0.24);
        }

        .action-btn:hover {
          transform: translateY(-1px);
        }

        @media (max-width: 1024px) {
          .admin-columns {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .admin-page {
            padding: 24px 16px 60px;
          }

          .admin-hero,
          .admin-panel {
            padding: 24px;
          }

          .admin-table th,
          .admin-table td {
            padding: 12px 14px;
          }
        }
      `}</style>
    </main>
  );
}
