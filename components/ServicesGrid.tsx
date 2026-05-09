"use client";

import { Service } from "@/types";
import ServiceCard from "./ServiceCard";

interface Props {
  services: Service[];
  onBook: (id: string, name: string) => void;
}

export default function ServicesGrid({ services, onBook }: Props) {
  return (
    <section id="services" className="services-section">
      <div id="booking" className="booking-anchor"></div>
      <div className="section-header">
        <span className="section-label">— Layanan Kami</span>
        <h2 className="section-title">
          Pilih Pengalaman
          <br />
          yang Kamu Inginkan
        </h2>
      </div>

      <div className="services-grid">
        {services.map((service, i) => (
          <ServiceCard
            key={service.id}
            service={service}
            onBook={onBook}
            index={i}
          />
        ))}
      </div>

      <style>{`
        .services-section {
          padding: 0 24px 80px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .section-header {
          margin-bottom: 48px;
        }

        .section-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #7c6fa0;
          display: block;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 600;
          color: #f5f0eb;
          line-height: 1.15;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.04);
        }

        @media (max-width: 640px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
