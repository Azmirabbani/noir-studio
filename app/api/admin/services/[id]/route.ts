import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(request: Request, context: any) {
  let id = context.params?.id;
  if (!id) {
    const pathSegments = new URL(request.url).pathname
      .split("/")
      .filter(Boolean);
    id = pathSegments[pathSegments.length - 1];
  }
  const body = await request.json();
  const name = String(body.name || "").trim();
  const price = Number(body.price ?? NaN);
  const duration = Number(body.duration ?? NaN);
  const description = String(body.description || "").trim();

  if (!id) {
    return NextResponse.json(
      { error: "ID service tidak ditemukan." },
      { status: 400 },
    );
  }

  if (!name || Number.isNaN(price) || Number.isNaN(duration)) {
    return NextResponse.json(
      { error: "Nama, harga, dan durasi service wajib diisi dengan benar." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("services")
    .update({
      name,
      price,
      duration,
      description: description || null,
    })
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data?.length) {
    return NextResponse.json(
      { error: "Service tidak ditemukan." },
      { status: 404 },
    );
  }

  return NextResponse.json({ service: data[0] });
}

export async function DELETE(request: Request, context: any) {
  let id = context.params?.id;
  if (!id) {
    const pathSegments = new URL(request.url).pathname
      .split("/")
      .filter(Boolean);
    id = pathSegments[pathSegments.length - 1];
  }

  if (!id) {
    return NextResponse.json(
      { error: "ID service tidak ditemukan." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("services")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data?.length) {
    return NextResponse.json(
      { error: "Service tidak ditemukan." },
      { status: 404 },
    );
  }

  return NextResponse.json({ message: "Service dihapus." });
}
