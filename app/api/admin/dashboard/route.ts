import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const [
    { data: bookings, error: bookingError },
    { data: services, error: servicesError },
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select(
        "id, service_id, customer_name, phone, booking_date, booking_time, created_at",
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("services")
      .select("id, name, price, duration")
      .order("name", { ascending: true }),
  ]);

  if (bookingError || servicesError) {
    return NextResponse.json(
      {
        error:
          bookingError?.message ||
          servicesError?.message ||
          "Gagal memuat data admin.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ bookings, services });
}
