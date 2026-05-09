"use client";

import { Service } from "@/types";
import { SERVICE_META, DEFAULT_META } from "@/lib/constants";

interface Props {
  service: Service;
  onBook: (id: string, name: string) => void;
  index: number;
}

export default function ServiceCard({ service, onBook, index }: Props) {
  const meta = SERVICE_META[service.name] ?? DEFAULT_META;

  // Available images in public folder
  const availableImages = ["haircut", "facial", "massage"];
  const hasImage = availableImages.includes(service.name.toLowerCase());

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div
      className="service-card"
      style={
        {
          "--card-accent": meta.accent,
          "--anim-delay": `${index * 0.1}s`,
        } as React.CSSProperties
      }
    >
      <div className="card-top">
        <span className="card-number">0{index + 1}</span>
        <span className="card-icon">{meta.icon}</span>
      </div>

      {hasImage && (
        <div className="card-image">
          <img
            src={`/${service.name.toLowerCase()}.jpeg`}
            alt={`${service.name} treatment at NOIR Studio`}
            className="service-image"
          />
        </div>
      )}

      <div
        className="card-body"
        style={!hasImage ? { marginTop: "28px" } : undefined}
      >
        <h3 className="card-name">{service.name}</h3>
        <p className="card-tagline">{meta.tagline}</p>
        {service.description && (
          <p className="card-description">{service.description}</p>
        )}
      </div>

      <div className="card-divider" />

      <div className="card-meta">
        <div className="card-duration">
          <span className="meta-label">Durasi</span>
          <span className="meta-value">{service.duration} min</span>
        </div>
        <div className="card-price-block">
          <span className="meta-label">Mulai dari</span>
          <span className="card-price">{formatPrice(service.price)}</span>
        </div>
      </div>

      <div className="card-actions">
        <button
          className="book-btn book-btn-primary"
          onClick={() => onBook(service.id, service.name)}
        >
          <span>Book Now</span>
          <span className="btn-arrow">→</span>
        </button>
        <button
          className="book-btn book-btn-secondary"
          onClick={() => {
            window.dispatchEvent(new CustomEvent("open-noir-chat"));
          }}
        >
          <span>Konsultasi AI</span>
          <span className="btn-icon">✦</span>
        </button>
      </div>

      <div className="card-glow" />

      <style>{`
        .service-card {
          position: relative;
          background: rgba(15, 12, 22, 0.8);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
          padding: 36px 32px 36px;
          overflow: hidden;
          transition: border-color 0.4s ease, transform 0.4s ease;
          animation: cardReveal 0.6s ease both;
          animation-delay: var(--anim-delay);
        }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .service-card:hover {
          border-color: rgba(var(--card-accent), 0.3);
          transform: translateY(-6px);
        }

        .service-card:hover .card-glow {
          opacity: 1;
        }

        .service-card:hover .book-btn-primary {
          background: color-mix(in srgb, var(--card-accent) 90%, black);
          border-color: color-mix(in srgb, var(--card-accent) 90%, black);
        }

        .service-card:hover .btn-arrow {
          transform: translateX(4px);
        }

        .service-card:hover .btn-icon {
          transform: scale(1.1);
        }

        .card-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 0% 0%,
            color-mix(in srgb, var(--card-accent) 12%, transparent),
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .card-image {
          margin-bottom: 24px;
          border-radius: 2px;
          overflow: hidden;
          background: rgba(255,255,255,0.02);
        }

        .service-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .service-card:hover .service-image {
          transform: scale(1.02);
        }

        .card-number {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 300;
          letter-spacing: 3px;
          color: #4b5563;
        }

        .card-icon {
          font-size: 1.4rem;
          color: var(--card-accent);
          line-height: 1;
        }

        .card-body {
          margin-bottom: 28px;
        }

        .card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 600;
          color: #f5f0eb;
          line-height: 1.1;
          margin-bottom: 6px;
        }

        .card-tagline {
          font-family: 'Outfit', sans-serif;
          font-size: 0.75rem;
          font-weight: 300;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #6b7280;
        }

        .card-description {
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          font-weight: 300;
          color: #9ca3af;
          line-height: 1.5;
          margin-top: 8px;
        }

        .card-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin-bottom: 24px;
        }

        .card-meta {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
        }

        .card-duration, .card-price-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .meta-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #4b5563;
        }

        .meta-value {
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          color: #9ca3af;
        }

        .card-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--card-accent);
          line-height: 1.1;
        }

        .card-actions {
          display: flex;
          gap: 12px;
        }

        .book-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 20px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 2px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .book-btn-primary {
          background: var(--card-accent);
          border-color: var(--card-accent);
          color: #0a0a0f;
        }

        .book-btn-secondary {
          background: transparent;
          border-color: rgba(255,255,255,0.1);
        }

        .book-btn-secondary:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.2);
        }

        .btn-arrow, .btn-icon {
          transition: transform 0.3s ease;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
