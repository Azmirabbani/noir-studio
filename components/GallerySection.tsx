"use client";

import { useCallback, useEffect, useState } from "react";

const PHOTOS = [
  {
    src: "/salon.jpeg",
    alt: "Interior NOIR Studio dengan pencahayaan hangat",
    caption: "Ruang yang tenang dan eksklusif",
  },
  {
    src: "/haircut.jpeg",
    alt: "Stylist sedang merapikan rambut pelanggan",
    caption: "Haircut dengan detail presisi",
  },
  {
    src: "/facial.jpeg",
    alt: "Pelanggan menjalani perawatan facial",
    caption: "Facial untuk kulit yang segar",
  },
  {
    src: "/massage.jpeg",
    alt: "Ruang massage yang bersih dan menenangkan",
    caption: "Massage untuk relaksasi penuh",
  },
];

export default function GallerySection() {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const move = useCallback(
    (dir: 1 | -1) =>
      setActive((i) =>
        i === null ? i : (i + dir + PHOTOS.length) % PHOTOS.length,
      ),
    [],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, move]);

  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-header">
        <span className="gallery-label">— Galeri</span>
        <h2 className="gallery-title">
          Suasana dan Hasil Kerja
          <br />
          di NOIR Studio
        </h2>
      </div>

      <div className="gallery-grid">
        {PHOTOS.map((p, i) => (
          <button
            key={p.src}
            type="button"
            className={`gallery-tile tile-${i}`}
            onClick={() => setActive(i)}
            aria-label={`Perbesar foto: ${p.caption}`}
          >
            <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
            <span className="gallery-caption">{p.caption}</span>
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau foto"
          onClick={close}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={close}
            aria-label="Tutup pratinjau"
          >
            ×
          </button>
          <button
            type="button"
            className="lightbox-nav"
            onClick={(e) => {
              e.stopPropagation();
              move(-1);
            }}
            aria-label="Foto sebelumnya"
          >
            ‹
          </button>
          <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img src={PHOTOS[active].src} alt={PHOTOS[active].alt} />
            <figcaption>{PHOTOS[active].caption}</figcaption>
          </figure>
          <button
            type="button"
            className="lightbox-nav"
            onClick={(e) => {
              e.stopPropagation();
              move(1);
            }}
            aria-label="Foto berikutnya"
          >
            ›
          </button>
        </div>
      )}

      <style>{`
        .gallery-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px 120px;
          scroll-margin-top: 90px;
        }

        .gallery-header { margin-bottom: 48px; }

        .gallery-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #7c6fa0;
          display: block;
          margin-bottom: 16px;
        }

        .gallery-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 600;
          color: #f5f0eb;
          line-height: 1.15;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          grid-template-rows: repeat(3, 1fr);
          gap: 1px;
          height: 520px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.04);
        }

        .tile-0 { grid-row: 1 / span 3; }

        .gallery-tile {
          position: relative;
          overflow: hidden;
          padding: 0;
          border: none;
          background: #0a0810;
          cursor: zoom-in;
          min-height: 0;
        }

        .gallery-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: saturate(0.9) brightness(0.85);
          transition: transform 0.6s ease, filter 0.4s ease;
        }

        .gallery-tile:hover img,
        .gallery-tile:focus-visible img {
          transform: scale(1.04);
          filter: saturate(1) brightness(1);
        }

        .gallery-tile:focus-visible {
          outline: 2px solid #a78bfa;
          outline-offset: -2px;
        }

        .gallery-caption {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 32px 20px 16px;
          text-align: left;
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 300;
          letter-spacing: 0.04em;
          color: #f5f0eb;
          background: linear-gradient(to top, rgba(5,5,10,0.85), transparent);
        }

        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 24px;
          background: rgba(5,5,10,0.92);
          animation: lightboxIn 0.2s ease;
        }

        @keyframes lightboxIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-figure {
          margin: 0;
          max-width: min(900px, 80vw);
          text-align: center;
        }

        .lightbox-figure img {
          max-width: 100%;
          max-height: 75vh;
          object-fit: contain;
          display: block;
          margin: 0 auto;
        }

        .lightbox-figure figcaption {
          margin-top: 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          font-weight: 300;
          color: #9ca3af;
        }

        .lightbox-close,
        .lightbox-nav {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #f5f0eb;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 1.6rem;
          line-height: 1;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s ease;
        }

        .lightbox-close:hover,
        .lightbox-nav:hover { background: rgba(167,139,250,0.2); }

        .lightbox-close:focus-visible,
        .lightbox-nav:focus-visible {
          outline: 2px solid #a78bfa;
          outline-offset: 2px;
        }

        .lightbox-close {
          position: absolute;
          top: 20px;
          right: 24px;
        }

        @media (max-width: 768px) {
          .gallery-section { padding-bottom: 80px; }
          .gallery-grid {
            grid-template-columns: 1fr;
            grid-template-rows: none;
            height: auto;
          }
          .tile-0 { grid-row: auto; }
          .gallery-tile { height: 220px; }
          .lightbox { padding: 12px; gap: 8px; }
          .lightbox-nav { width: 36px; height: 36px; }
        }
      `}</style>
    </section>
  );
}
