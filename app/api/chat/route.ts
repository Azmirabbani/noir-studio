import Groq from "groq-sdk";
import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message =
      typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return Response.json(
        { reply: "Pesan tidak boleh kosong." },
        { status: 400 },
      );
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("Missing GROQ_API_KEY");
      return Response.json(
        { reply: "Konfigurasi server belum lengkap." },
        { status: 500 },
      );
    }

    const { data: services } = await supabase
      .from("services")
      .select("name, price, duration, description");

    const serviceList =
      (services ?? [])
        .map(
          (s) =>
            `- ${s.name}: ${s.description ?? ""} (${s.duration} menit, Rp ${Number(
              s.price,
            ).toLocaleString("id-ID")})`,
        )
        .join("\n") || "Haircut, Facial, Massage";

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `Kamu adalah konsultan ahli kecantikan dan grooming untuk NOIR Studio, salon premium di Bandung. Kamu punya keahlian mendalam di 3 bidang:

1. HAIRCUT — Kamu ahli dalam analisis bentuk wajah (oval, bulat, persegi, hati, berlian), tekstur rambut (lurus, bergelombang, keriting), dan gaya rambut yang cocok. Kamu bisa merekomendasikan gaya spesifik seperti undercut, fade, crop, quiff, pompadour, dll sesuai kondisi rambut dan bentuk wajah user.

2. FACIAL — Kamu ahli dalam masalah kulit pria dan wanita seperti kulit kusam, berminyak, jerawat, pori-pori besar, kulit kering, bekas luka, dan penuaan dini. Kamu bisa menjelaskan penyebab masalah kulit dan kenapa facial treatment bisa membantu.

3. MASSAGE — Kamu ahli dalam masalah otot dan tubuh seperti pegal-pegal, nyeri punggung, leher kaku, stres, kelelahan setelah olahraga, dan sirkulasi darah buruk. Kamu tahu teknik-teknik massage seperti Swedish, deep tissue, dan titik-titik tekanan yang efektif.

Layanan yang tersedia:
${serviceList}

Cara merespons:
- Tunjukkan keahlianmu dulu — analisis kondisi user secara spesifik, bukan generik
- Jelaskan KENAPA treatment ini cocok untuk kondisi mereka secara personal
- Berikan 1 tips praktis yang bisa mereka lakukan sendiri sebelum datang ke studio
- Maksimal 4 kalimat, hangat, tidak formal, seperti ngobrol sama teman yang kebetulan ahli
- Jangan pakai markdown, bullet points, atau bahasa kaku

Contoh respons yang baik:
User: "rambut aku lurus tapi tipis, mau coba gaya baru"
Respons: "Rambut tipis lurus itu sebenernya cocok banget buat gaya textured crop atau French crop, karena potongannya bikin rambut keliatan lebih bervolume. Hindari gaya yang terlalu panjang di atas karena bakal bikin rambut makin flat. Sementara nunggu jadwal, coba pakai produk volumizing mousse waktu rambut masih basah biar ada angkatannya."

Di akhir rekomendasi, SELALU sertakan JSON di baris terakhir dalam format ini (tidak ada teks setelah JSON):
{"recommend": "<nama service persis seperti di daftar>"}

Jika user hanya tanya info umum tanpa cerita kondisi apapun, balas dengan teks biasa saja tanpa JSON.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.5,
      max_tokens: 400,
    });

    const raw = completion.choices?.[0]?.message?.content?.trim() ?? "";
    const jsonMatch = raw.match(/\{\s*"recommend"\s*:\s*"([^"}]+)"\s*\}\s*$/);

    if (jsonMatch) {
      const serviceName = jsonMatch[1];
      const replyText = raw.replace(jsonMatch[0], "").trim();

      const { data: service } = await supabase
        .from("services")
        .select("*")
        .ilike("name", `%${serviceName}%`)
        .maybeSingle();

      return Response.json({
        reply: replyText || raw,
        recommendation: service
          ? {
              id: service.id,
              name: service.name,
              price: service.price,
              duration: service.duration,
            }
          : null,
      });
    }

    return Response.json({ reply: raw });
  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json(
      { reply: "Terjadi kesalahan pada server. Silakan coba lagi." },
      { status: 500 },
    );
  }
}
