import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const service_id = searchParams.get("service_id");
  const date = searchParams.get("date");

  if (!service_id || !date) {
    return Response.json({ bookedSlots: [] });
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("booking_time")
    .eq("service_id", service_id)
    .eq("booking_date", date);

  if (error) {
    return Response.json({ bookedSlots: [] }, { status: 400 });
  }

  // Format: ["10:00", "11:30", ...]
  const bookedSlots = (data ?? [])
    .map((b) => {
      // booking_time dari supabase bisa "10:00:00", potong jadi "10:00"
      const t = b.booking_time as string;
      return t ? t.slice(0, 5) : null;
    })
    .filter(Boolean) as string[];

  return Response.json({ bookedSlots });
}
