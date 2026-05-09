"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Service } from "@/types";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import ChatBox from "@/components/ChatBox";
import Toast from "@/components/Toast";
import BookingModal from "@/components/BookingModal";
import FloatingChat from "@/components/FloatingChat";

interface ToastState {
  message: string;
  type: "success" | "error";
  id: number;
}

const testimonials = [
  {
    name: "Raka Firmansyah",
    role: "Creative Director",
    text: "Beda banget sama barbershop biasa. Suasananya tenang, hasilnya presisi. Udah jadi langganan tetap sejak bulan pertama buka.",
    rating: 5,
    initial: "R",
  },
  {
    name: "Dimas Pratama",
    role: "Entrepreneur",
    text: "Facial treatment-nya luar biasa. Kulit gue jelas lebih baik setelah 2x session. Tim-nya profesional dan gak basa-basi.",
    rating: 5,
    initial: "D",
  },
  {
    name: "Arief Nugroho",
    role: "Software Engineer",
    text: "Booking via AI-nya gampang banget, langsung konfirmasi. Massage 90 menit paling worth it yang pernah gue coba.",
    rating: 5,
    initial: "A",
  },
];

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from("services").select("*");
    setServices((data as Service[]) || []);
    setLoadingServices(false);
  };

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type, id: Date.now() });
    },
    [],
  );

  const handleOpenBooking = useCallback(
    (serviceId: string) => {
      const service = services.find((s) => s.id === serviceId) ?? null;
      setSelectedService(service);
    },
    [services],
  );

  const handleOpenGeneralBooking = useCallback(() => {
    // Scroll to services section so user can pick which service to book
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleBookingSuccess = useCallback(
    (serviceName: string) => {
      showToast(
        `Booking ${serviceName} berhasil! Sampai jumpa di NOIR Studio ✦`,
        "success",
      );
    },
    [showToast],
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html { scroll-behavior: smooth; }

        body {
          background: #05050a;
          color: #f5f0eb;
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .page-root {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .bg-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .bg-gradient-top {
          position: absolute;
          width: 800px;
          height: 800px;
          top: -300px;
          left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(ellipse, rgba(88, 28, 135, 0.15), transparent 70%);
          border-radius: 50%;
        }

        .bg-gradient-bottom-right {
          position: absolute;
          width: 600px;
          height: 600px;
          bottom: 0;
          right: -200px;
          background: radial-gradient(ellipse, rgba(219, 39, 119, 0.08), transparent 70%);
          border-radius: 50%;
        }

        .bg-noise {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
        }

        .page-content {
          position: relative;
          z-index: 1;
        }

        /* ── Skeleton ── */
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.04);
          max-width: 1200px;
          margin: 0 auto 80px;
          padding: 0 24px;
        }

        .skeleton-card {
          height: 320px;
          background: rgba(15, 12, 22, 0.8);
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .skeleton-line {
          border-radius: 2px;
          background: linear-gradient(90deg,
            rgba(255,255,255,0.04) 0%,
            rgba(255,255,255,0.07) 50%,
            rgba(255,255,255,0.04) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.8s ease infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── About Section ── */
        .about-section {
          max-width: 680px;
          margin: 0 auto;
          padding: 0 24px 100px;
        }

        .about-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #7c6fa0;
          display: block;
          margin-bottom: 16px;
        }

        .about-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 600;
          color: #f5f0eb;
          line-height: 1.15;
          margin-bottom: 28px;
        }

        .about-body {
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #6b7280;
          line-height: 1.85;
          margin-bottom: 16px;
        }

        .about-body:last-child { margin-bottom: 0; }

        @media (max-width: 768px) {
          .about-section {
            padding: 0 24px 60px;
          }
        }

        /* ── Testimonials Section ── */
        .testimonials-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px 120px;
        }

        .testimonials-header {
          margin-bottom: 48px;
        }

        .testimonials-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #7c6fa0;
          display: block;
          margin-bottom: 16px;
        }

        .testimonials-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 600;
          color: #f5f0eb;
          line-height: 1.15;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.04);
        }

        .testimonial-card {
          background: rgba(10, 8, 16, 0.6);
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: background 0.3s ease;
        }

        .testimonial-card:hover {
          background: rgba(20, 15, 32, 0.9);
        }

        .testimonial-stars {
          display: flex;
          gap: 3px;
        }

        .star {
          color: #a78bfa;
          font-size: 0.7rem;
        }

        .testimonial-text {
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          font-weight: 300;
          color: #9ca3af;
          line-height: 1.8;
          flex: 1;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .author-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(167,139,250,0.1);
          border: 1px solid rgba(167,139,250,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: #a78bfa;
          flex-shrink: 0;
        }

        .author-name {
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: #f5f0eb;
          display: block;
        }

        .author-role {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 300;
          color: #4b5563;
          letter-spacing: 1px;
          display: block;
          margin-top: 2px;
        }

        @media (max-width: 768px) {
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ── Footer Section ── */
        .site-footer {
          padding: 48px 24px 64px;
          background: rgba(255,255,255,0.02);
          border-top: 1px solid rgba(255,255,255,0.06);
          margin-top: 24px;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
        }

        .footer-label {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #7c6fa0;
          margin-bottom: 12px;
        }

        .footer-text {
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #9ca3af;
          line-height: 1.8;
          margin-bottom: 8px;
        }

        .footer-address {
          min-width: 240px;
        }

        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="page-root">
        <div className="bg-layer">
          <div className="bg-gradient-top" />
          <div className="bg-gradient-bottom-right" />
          <div className="bg-noise" />
        </div>

        <div className="page-content">
          <Navbar onOpenBooking={handleOpenGeneralBooking} />
          <HeroSection />

          {loadingServices ? (
            <div className="skeleton-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card">
                  <div
                    className="skeleton-line"
                    style={{ height: 12, width: "30%" }}
                  />
                  <div
                    className="skeleton-line"
                    style={{ height: 40, width: "60%", marginTop: 16 }}
                  />
                  <div
                    className="skeleton-line"
                    style={{ height: 12, width: "45%" }}
                  />
                  <div style={{ flex: 1 }} />
                  <div
                    className="skeleton-line"
                    style={{ height: 48, width: "100%", marginTop: "auto" }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <ServicesGrid services={services} onBook={handleOpenBooking} />
          )}

          {/* ✦ About Section */}
          <section id="about" className="about-section">
            <div>
              <span className="about-label">— Tentang Kami</span>
              <h2 className="about-title">
                Lebih dari Sekadar
                <br />
                Grooming
              </h2>
              <p className="about-body">
                NOIR Studio lahir dari keyakinan bahwa perawatan diri bukan
                sekadar rutinitas — melainkan sebuah ritual. Kami menghadirkan
                pengalaman premium yang menggabungkan keahlian profesional
                dengan suasana eksklusif.
              </p>
              <p className="about-body">
                Setiap layanan dirancang dengan detail, dari teknik yang presisi
                hingga produk pilihan yang kami gunakan. Karena kamu layak
                mendapatkan yang terbaik.
              </p>
            </div>
          </section>

          {/* ✦ Testimonials Section */}
          <section id="testimonials" className="testimonials-section">
            <div className="testimonials-header">
              <span className="testimonials-label">— Kata Mereka</span>
              <h2 className="testimonials-title">
                Pengalaman Nyata
                <br />
                dari Klien Kami
              </h2>
            </div>

            <div className="testimonials-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="testimonial-stars">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <span key={j} className="star">
                        ✦
                      </span>
                    ))}
                  </div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">{t.initial}</div>
                    <div>
                      <span className="author-name">{t.name}</span>
                      <span className="author-role">{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ✦ Footer Section */}
          <footer id="footer" className="site-footer">
            <div className="footer-content">
              <div>
                <span className="footer-label">NOIR Studio</span>
                <p className="footer-text">
                  Salon premium di Bandung dengan treatment haircut, facial, dan
                  massage yang dirancang untuk kenyamanan kamu.
                </p>
              </div>

              <div className="footer-address">
                <span className="footer-label">Alamat</span>
                <p className="footer-text">Jl. Riau No. 12, Bandung</p>
                <p className="footer-text">Jl. Braga No. 45, Bandung</p>
                <p className="footer-text">Jl. Dago Asri No. 8, Bandung</p>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* ✦ Floating Chat Widget */}
      <FloatingChat onOpenBooking={handleOpenBooking} />

      <BookingModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onSuccess={handleBookingSuccess}
      />

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
