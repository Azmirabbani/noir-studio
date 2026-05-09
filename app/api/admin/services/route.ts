import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const price = Number(body.price ?? NaN);
  const duration = Number(body.duration ?? NaN);
  if (!name || Number.isNaN(price) || Number.isNaN(duration)) {
    return NextResponse.json(
      { error: "Nama, harga, dan durasi service wajib diisi dengan benar." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.from("services").insert({
    name,
    price,
    duration,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ service: data?.[0] });
}

export async function GET() {
  const { data, error } = await supabase
    .from("services")
    .select("id, name, price, duration")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ services: data });
}
