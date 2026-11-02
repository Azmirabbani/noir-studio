"use client";

import { useState } from "react";
import { BRANCHES, OPENING_HOURS } from "@/lib/constants";

export default function BranchesSection() {
  const [activeId, setActiveId] = useState(BRANCHES[0].id);
  const active = BRANCHES.find((b) => b.id === activeId) ?? BRANCHES[0];

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    active.mapQuery,
  )}&hl=id&z=15&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    active.mapQuery,
  )}`;

  return (
    <section id="branches" className="branches-section">
      <div className="branches-header">
        <span className="branches-label">— Cabang</span>
        <h2 className="branches-title">
          Tiga Lokasi
          <br />
          di Bandung
        </h2>
      </div>

      <div className="branches-layout">
        <div className="branches-list" role="group" aria-label="Pilih cabang">
          {BRANCHES.map((b, i) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={b.id === activeId}
              className={`branch-card ${b.id === activeId ? "branch-active" : ""}`}
              onClick={() => setActiveId(b.id)}
            >
              <span className="branch-index">0{i + 1}</span>
              <span className="branch-name">{b.name}</span>
              <span className="branch-area">{b.area}</span>
              <span className="branch-note">{b.note}</span>
            </button>
          ))}

          <p className="branch-hours">
            <span>Jam operasional</span>
            {OPENING_HOURS}
          </p>
        </div>

        <div className="branch-map">
          <iframe
            key={active.id}
            title={`Peta area ${active.name}`}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="branch-map-footer">
            <span>
              Lokasi contoh: peta menampilkan area jalan, bukan alamat sebenarnya.
            </span>
            <a href={mapLink} target="_blank" rel="noopener noreferrer">
              Buka di Google Maps ↗
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .branches-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px 120px;
          scroll-margin-top: 90px;
        }

        .branches-header { margin-bottom: 48px; }

        .branches-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #7c6fa0;
          display: block;
          margin-bottom: 16px;
        }

        .branches-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 600;
          color: #f5f0eb;
          line-height: 1.15;
        }

        .branches-layout {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 1px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.04);
        }

        .branches-list {
          display: flex;
          flex-direction: column;
          background: rgba(10, 8, 16, 0.6);
        }

        .branch-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
          padding: 28px 32px;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          border-left: 2px solid transparent;
          cursor: pointer;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .branch-card:hover { background: rgba(20, 15, 32, 0.9); }

        .branch-card:focus-visible {
          outline: 2px solid #a78bfa;
          outline-offset: -2px;
        }

        .branch-active {
          background: rgba(20, 15, 32, 0.9);
          border-left-color: #a78bfa;
        }

        .branch-index {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 3px;
          color: #4b5563;
        }

        .branch-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: #f5f0eb;
          line-height: 1.2;
        }

        .branch-area {
          font-family: 'Outfit', sans-serif;
          font-size: 0.78rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #7c6fa0;
        }

        .branch-note {
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          font-weight: 300;
          color: #9ca3af;
          line-height: 1.7;
        }

        .branch-hours {
          margin-top: auto;
          padding: 24px 32px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #f5f0eb;
        }

        .branch-hours span {
          display: block;
          margin-bottom: 6px;
          font-size: 0.7rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #4b5563;
        }

        .branch-map {
          display: flex;
          flex-direction: column;
          background: rgba(10, 8, 16, 0.6);
          min-height: 420px;
        }

        .branch-map iframe {
          flex: 1;
          width: 100%;
          min-height: 360px;
          border: 0;
          filter: grayscale(0.35) brightness(0.88);
        }

        .branch-map-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          padding: 14px 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
          font-family: 'Outfit', sans-serif;
          font-size: 0.72rem;
          font-weight: 300;
          color: #6b7280;
        }

        .branch-map-footer a {
          color: #c4b5fd;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s ease;
        }

        .branch-map-footer a:hover { color: #ede9fe; }

        @media (max-width: 768px) {
          .branches-section { padding-bottom: 80px; }
          .branches-layout { grid-template-columns: 1fr; }
          .branch-card { padding: 22px 24px; }
          .branch-hours { padding: 20px 24px; }
          .branch-map { min-height: 340px; }
        }
      `}</style>
    </section>
  );
}
