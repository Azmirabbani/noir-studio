const FAQS = [
  {
    q: "Bagaimana cara melakukan booking?",
    a: "Pilih layanan yang kamu inginkan, tekan Book Now, lalu isi nama, nomor HP, tanggal, dan jam yang tersedia. Kamu juga bisa meminta rekomendasi lewat Konsultasi AI, lalu langsung booking dari kartu rekomendasinya.",
  },
  {
    q: "Apakah saya perlu membuat akun?",
    a: "Tidak perlu. Cukup isi nama dan nomor HP saat booking.",
  },
  {
    q: "Berapa lama durasi dan berapa harga setiap layanan?",
    a: "Durasi dan harga tertera pada kartu masing-masing layanan di bagian Layanan.",
  },
  {
    q: "Bagaimana jika saya perlu mengubah atau membatalkan jadwal?",
    a: "Untuk saat ini, perubahan jadwal dilakukan dengan menghubungi cabang yang kamu pilih. Fitur ubah dan batalkan secara online masih dalam pengembangan.",
  },
  {
    q: "Apakah Konsultasi AI bisa menggantikan konsultasi langsung?",
    a: "Konsultasi AI memberi rekomendasi umum seputar rambut, kulit wajah, dan relaksasi. Untuk keluhan kulit atau kesehatan yang serius, tetap konsultasikan dengan dokter.",
  },
  {
    q: "Data apa saja yang disimpan saat booking?",
    a: "Hanya nama, nomor HP, layanan, serta tanggal dan jam booking, untuk keperluan reservasi.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqSection() {
  return (
    <section id="faq" className="faq-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="faq-header">
        <span className="faq-label">— FAQ</span>
        <h2 className="faq-title">
          Pertanyaan yang
          <br />
          Sering Diajukan
        </h2>
      </div>

      <div className="faq-list">
        {FAQS.map((f) => (
          <details key={f.q} className="faq-item">
            <summary className="faq-question">
              <span>{f.q}</span>
              <span className="faq-icon" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="faq-answer">{f.a}</p>
          </details>
        ))}
      </div>

      <style>{`
        .faq-section {
          max-width: 820px;
          margin: 0 auto;
          padding: 0 24px 120px;
          scroll-margin-top: 90px;
        }

        .faq-header { margin-bottom: 40px; }

        .faq-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #7c6fa0;
          display: block;
          margin-bottom: 16px;
        }

        .faq-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 600;
          color: #f5f0eb;
          line-height: 1.15;
        }

        .faq-list {
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .faq-item {
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 22px 4px;
          cursor: pointer;
          list-style: none;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          color: #f5f0eb;
          transition: color 0.2s ease;
        }

        .faq-question::-webkit-details-marker { display: none; }
        .faq-question:hover { color: #c4b5fd; }

        .faq-question:focus-visible {
          outline: 2px solid #a78bfa;
          outline-offset: 2px;
        }

        .faq-icon {
          flex-shrink: 0;
          font-size: 1.3rem;
          font-weight: 300;
          color: #a78bfa;
          transition: transform 0.25s ease;
        }

        .faq-item[open] .faq-icon { transform: rotate(45deg); }

        .faq-answer {
          padding: 0 4px 24px;
          max-width: 680px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          font-weight: 300;
          color: #9ca3af;
          line-height: 1.85;
        }

        @media (max-width: 768px) {
          .faq-section { padding-bottom: 80px; }
        }
      `}</style>
    </section>
  );
}
