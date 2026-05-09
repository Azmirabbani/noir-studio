import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
      { error: "ID booking tidak ditemukan." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data?.length) {
    return NextResponse.json(
      { error: "Booking tidak ditemukan." },
      { status: 404 },
    );
  }

  return NextResponse.json({ message: "Booking dihapus." });
}
