import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service_id, customer_name, phone, booking_date, booking_time } =
      body;

    if (!service_id) {
      return Response.json({ error: "service_id diperlukan" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        { service_id, customer_name, phone, booking_date, booking_time },
      ])
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ data, success: true });
  } catch (err) {
    console.error("Booking error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
