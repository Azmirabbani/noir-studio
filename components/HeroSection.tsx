"use client";

import { SALON_NAME, SALON_TAGLINE, SALON_SUBTITLE } from "@/lib/constants";

const stats = [
  { value: "1.200+", label: "Klien Puas" },
  { value: "4.9", label: "Rating" },
  { value: "5", label: "Profesional" },
  { value: "3", label: "Layanan Premium" },
];

export default function HeroSection() {
  const openChat = () => {
    window.dispatchEvent(new CustomEvent("open-noir-chat"));
  };

  return (
    <section id="home" className="hero">
      <div className="hero-eyebrow">
        <span className="eyebrow-line" />
        <span className="eyebrow-text">Est. 2024 · Premium Grooming</span>
        <span className="eyebrow-line" />
      </div>

      <h1 className="hero-title">
        <span className="title-serif">{SALON_NAME}</span>
        <span className="title-light">{SALON_TAGLINE}</span>
      </h1>

      <p className="hero-subtitle">
        Perawatan eksklusif dengan detail profesional, untuk kamu yang ingin
        tampil rapi, segar, dan percaya diri setiap hari.
      </p>

      <div className="hero-actions">
        <a href="#services" className="hero-btn hero-btn-primary">
          Telusuri Layanan
        </a>
        <button className="hero-btn hero-btn-secondary" onClick={openChat}>
          Konsultasi AI Gratis
        </button>
      </div>

      <div className="hero-stats">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
            {i < stats.length - 1 && <span className="stat-divider" />}
          </div>
        ))}
      </div>

      <div className="hero-scroll-hint">
        <span>Scroll untuk lihat layanan</span>
        <div className="scroll-line" />
      </div>

      <style>{`
        .hero {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
          position: relative;
          background-image: url('/salon.jpeg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(5, 5, 10, 0.7);
          backdrop-filter: blur(1px);
        }

        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
        }

        .eyebrow-line {
          display: block;
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(167,139,250,0.6));
        }

        .eyebrow-line:last-child {
          background: linear-gradient(90deg, rgba(167,139,250,0.6), transparent);
        }

        .eyebrow-text {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #7c6fa0;
        }

        .hero-title {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          line-height: 1;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }

        .title-serif {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(5rem, 18vw, 13rem);
          font-weight: 700;
          color: #f5f0eb;
          letter-spacing: 12px;
          text-transform: uppercase;
          line-height: 0.9;
        }

        .title-light {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(0.8rem, 2vw, 1.1rem);
          font-weight: 300;
          letter-spacing: 10px;
          text-transform: uppercase;
          color: #7c6fa0;
          margin-top: 12px;
        }

        .hero-subtitle {
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 300;
          color: #6b7280;
          letter-spacing: 0.05em;
          max-width: 440px;
          line-height: 1.7;
          margin-bottom: 40px;
          position: relative;
          z-index: 1;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 14px;
          margin-bottom: 52px;
          position: relative;
          z-index: 1;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 24px;
          border-radius: 999px;
          border: 1px solid transparent;
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
        }

        .hero-btn-primary {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          color: #fff;
          box-shadow: 0 18px 40px rgba(139,92,246,0.2);
        }

        .hero-btn-primary:hover {
          transform: translateY(-1px);
        }

        .hero-btn-secondary {
          background: rgba(255,255,255,0.06);
          color: #f5f0eb;
          border-color: rgba(255,255,255,0.15);
        }

        .hero-btn-secondary:hover {
          background: rgba(255,255,255,0.1);
        }

        /* ✦ Stats */
        .hero-stats {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 56px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 2px;
          padding: 20px 40px;
          backdrop-filter: blur(8px);
          position: relative;
          z-index: 1;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 0 28px;
          position: relative;
        }

        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 600;
          color: #f5f0eb;
          line-height: 1;
        }

        .stat-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #7c6fa0;
        }

        .stat-divider {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 32px;
          background: rgba(255,255,255,0.07);
        }

        .hero-scroll-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .hero-scroll-hint span {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #4b5563;
        }

        .scroll-line {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, rgba(167,139,250,0.5), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.1); }
        }

        @media (max-width: 640px) {
          .hero-stats {
            padding: 16px 20px;
            gap: 0;
          }
          .stat-item {
            padding: 0 16px;
          }
          .stat-value {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </section>
  );
}
