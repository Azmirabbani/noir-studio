"use client";

import { useState, useEffect } from "react";
import { Service } from "@/types";

interface Props {
  service: Service | null;
  onClose: () => void;
  onSuccess: (serviceName: string) => void;
}

// Generate slots 10:00 - 22:00 tiap 30 menit
function generateSlots(): string[] {
  const slots: string[] = [];
  for (let h = 10; h < 22; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

const ALL_SLOTS = generateSlots();

export default function BookingModal({ service, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    booking_date: "",
  });
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Fetch booked slots whenever date or service changes
  useEffect(() => {
    if (!form.booking_date || !service) return;
    setLoadingSlots(true);
    setSelectedSlot("");

    fetch(`/api/slots?service_id=${service.id}&date=${form.booking_date}`)
      .then((r) => r.json())
      .then((data) => {
        setBookedSlots(data.bookedSlots ?? []);
      })
      .catch(() => setBookedSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [form.booking_date, service?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!service) return;
    if (!form.customer_name.trim()) return setError("Nama wajib diisi.");
    if (!form.phone.trim()) return setError("Nomor HP wajib diisi.");
    if (!form.booking_date) return setError("Tanggal wajib dipilih.");
    if (!selectedSlot) return setError("Jam wajib dipilih.");

    setLoading(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: service.id,
          customer_name: form.customer_name,
          phone: form.phone,
          booking_date: form.booking_date,
          booking_time: selectedSlot,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(
          "Gagal booking. Slot mungkin sudah diambil, coba pilih jam lain.",
        );
      } else {
        onSuccess(service.name);
        onClose();
      }
    } catch {
      setError("Koneksi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-service-info">
            <span className="modal-label">Booking</span>
            <h2 className="modal-title">{service.name}</h2>
            <div className="modal-meta">
              <span>{service.duration} menit</span>
              <span className="meta-dot">·</span>
              <span className="modal-price">{formatPrice(service.price)}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-divider" />

        {/* Scrollable body */}
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input
              className="form-input"
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              placeholder="Masukkan nama kamu"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nomor HP / WhatsApp</label>
            <input
              className="form-input"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
              type="tel"
              autoComplete="tel"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tanggal</label>
            <input
              className="form-input"
              name="booking_date"
              value={form.booking_date}
              onChange={handleChange}
              type="date"
              min={today}
            />
          </div>

          {/* Time slots */}
          {form.booking_date && (
            <div className="form-group">
              <label className="form-label">
                Pilih Jam
                {loadingSlots && (
                  <span className="slots-loading"> · Memuat...</span>
                )}
              </label>

              {!loadingSlots && (
                <div className="slots-grid">
                  {ALL_SLOTS.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        className={`slot-btn ${isBooked ? "slot-booked" : ""} ${isSelected ? "slot-selected" : ""}`}
                        onClick={() => !isBooked && setSelectedSlot(slot)}
                        disabled={isBooked}
                        type="button"
                      >
                        {slot}
                        {isBooked && <span className="slot-dot" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {loadingSlots && (
                <div className="slots-skeleton">
                  {Array(12)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="slot-skel" />
                    ))}
                </div>
              )}
            </div>
          )}

          {error && <p className="form-error">{error}</p>}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading">
                <span />
                <span />
                <span />
              </span>
            ) : (
              <>Konfirmasi Booking →</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: overlayIn 0.2s ease;
        }

        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal {
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          background: #0d0b14;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 32px 32px 24px;
          flex-shrink: 0;
        }

        .modal-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #7c6fa0;
          display: block;
          margin-bottom: 8px;
        }

        .modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 600;
          color: #f5f0eb;
          line-height: 1.1;
          margin-bottom: 8px;
        }

        .modal-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 300;
          color: #6b7280;
        }

        .meta-dot { color: #374151; }

        .modal-price {
          color: #c4b5fd;
          font-weight: 400;
        }

        .modal-close {
          background: none;
          border: none;
          color: #4b5563;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 4px 8px;
          transition: color 0.2s;
          font-family: 'Outfit', sans-serif;
          flex-shrink: 0;
        }

        .modal-close:hover { color: #f5f0eb; }

        .modal-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 0 32px;
          flex-shrink: 0;
        }

        .modal-body {
          padding: 28px 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
          flex: 1;
          scrollbar-width: thin;
          scrollbar-color: rgba(167,139,250,0.2) transparent;
        }

        .modal-body::-webkit-scrollbar { width: 3px; }
        .modal-body::-webkit-scrollbar-track { background: transparent; }
        .modal-body::-webkit-scrollbar-thumb {
          background: rgba(167,139,250,0.2);
          border-radius: 3px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #6b7280;
        }

        .slots-loading {
          color: #4b5563;
          font-style: italic;
          letter-spacing: 0;
          text-transform: none;
          font-size: 0.65rem;
        }

        .form-input {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          padding: 12px 14px;
          color: #f5f0eb;
          font-family: 'Outfit', sans-serif;
          font-size: 0.875rem;
          font-weight: 300;
          outline: none;
          transition: border-color 0.2s ease;
          width: 100%;
        }

        .form-input::placeholder { color: #374151; }
        .form-input:focus { border-color: rgba(124, 58, 237, 0.5); }
        .form-input[type="date"] { color-scheme: dark; }

        /* Slots grid */
        .slots-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .slot-btn {
          position: relative;
          padding: 10px 6px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 2px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 300;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: center;
        }

        .slot-btn:hover:not(:disabled):not(.slot-selected) {
          border-color: rgba(124, 58, 237, 0.4);
          color: #c4b5fd;
          background: rgba(124, 58, 237, 0.08);
        }

        .slot-selected {
          background: rgba(124, 58, 237, 0.2) !important;
          border-color: rgba(124, 58, 237, 0.6) !important;
          color: #e9d5ff !important;
        }

        .slot-booked {
          background: rgba(255,255,255,0.01) !important;
          border-color: rgba(255,255,255,0.04) !important;
          color: #2d2d3a !important;
          cursor: not-allowed !important;
          text-decoration: line-through;
        }

        .slot-dot {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #374151;
        }

        /* Skeleton slots */
        .slots-skeleton {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .slot-skel {
          height: 38px;
          border-radius: 2px;
          background: linear-gradient(90deg,
            rgba(255,255,255,0.03) 0%,
            rgba(255,255,255,0.06) 50%,
            rgba(255,255,255,0.03) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.8s ease infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .form-error {
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          color: #f87171;
          font-weight: 300;
        }

        .modal-footer {
          padding: 20px 32px 28px;
          display: flex;
          gap: 12px;
          flex-shrink: 0;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .btn-cancel {
          flex: 1;
          padding: 13px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 1px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover:not(:disabled) {
          border-color: rgba(255,255,255,0.15);
          color: #9ca3af;
        }

        .btn-submit {
          flex: 2;
          padding: 13px 20px;
          background: rgba(124, 58, 237, 0.2);
          border: 1px solid rgba(124, 58, 237, 0.4);
          border-radius: 2px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 1px;
          color: #c4b5fd;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-submit:hover:not(:disabled) {
          background: rgba(124, 58, 237, 0.35);
          border-color: rgba(124, 58, 237, 0.7);
          color: #e9d5ff;
        }

        .btn-submit:disabled,
        .btn-cancel:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .btn-loading {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .btn-loading span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #c4b5fd;
          animation: btnDot 1.2s ease-in-out infinite;
        }

        .btn-loading span:nth-child(2) { animation-delay: 0.2s; }
        .btn-loading span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes btnDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        @media (max-width: 480px) {
          .modal-header, .modal-body, .modal-footer { padding-left: 20px; padding-right: 20px; }
          .modal-divider { margin: 0 20px; }
          .slots-grid, .slots-skeleton { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  );
}
