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
          content: `Kamu adalah konsultan kecantikan dan grooming untuk NOIR Studio, salon premium di Indonesia.

Layanan yang tersedia:
${serviceList}

Tugasmu adalah mendengarkan keluhan atau kebutuhan user, lalu merekomendasikan satu treatment yang paling cocok dengan alasan yang personal dan relevan. Jika user sudah menjelaskan kebutuhan atau keluhan, segera tawarkan treatment yang diperlukan berdasarkan layanan di daftar.

Contoh:
- User bilang "kulit aku kusam" → rekomendasikan Facial, jelaskan kenapa cocok
- User bilang "rambut udah panjang banget" → rekomendasikan Haircut
- User bilang "punggung pegel" → rekomendasikan Massage

Di akhir rekomendasi, SELALU sertakan JSON di baris terakhir dalam format ini (tidak ada teks setelah JSON):
{"recommend": "<nama service persis seperti di daftar>"}

Jika user tidak menceritakan kebutuhan apapun atau hanya bertanya info umum, balas dengan teks biasa saja tanpa JSON.

Balas dalam Bahasa Indonesia yang hangat, singkat (maksimal 3 kalimat), dan tidak formal. Jangan gunakan markdown atau bullet points.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.5,
      max_tokens: 300,
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
