import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_SECONDS,
  createAdminSession,
  getAdminEmails,
  verifyAdminSession,
} from "@/lib/admin-session";

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

// Cek apakah pengunjung punya sesi admin yang sah (dipakai Navbar).
export async function GET(req: NextRequest) {
  const session = await verifyAdminSession(
    req.cookies.get(ADMIN_COOKIE_NAME)?.value,
  );
  return NextResponse.json({ admin: Boolean(session) });
}

// Tukar access token Supabase menjadi cookie sesi admin yang ditandatangani server.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const accessToken =
      typeof body?.access_token === "string" ? body.access_token : "";

    if (!accessToken) {
      return NextResponse.json({ error: "Token tidak valid." }, { status: 400 });
    }

    const admins = getAdminEmails();
    if (admins.length === 0) {
      console.error("Admin login ditolak: ADMIN_EMAILS belum diatur di env.");
      return NextResponse.json(
        { error: "Konfigurasi server belum lengkap." },
        { status: 500 },
      );
    }

    const { data, error } = await supabase.auth.getUser(accessToken);
    const email = data?.user?.email?.toLowerCase();

    if (error || !email) {
      return NextResponse.json(
        { error: "Sesi login tidak valid." },
        { status: 401 },
      );
    }

    if (!admins.includes(email)) {
      return NextResponse.json(
        { error: "Akun ini tidak memiliki akses admin." },
        { status: 403 },
      );
    }

    const token = await createAdminSession(email);
    if (!token) {
      console.error(
        "Admin login ditolak: ADMIN_SESSION_SECRET belum diatur atau kurang dari 32 karakter.",
      );
      return NextResponse.json(
        { error: "Konfigurasi server belum lengkap." },
        { status: 500 },
      );
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      ...cookieBase,
      maxAge: ADMIN_SESSION_SECONDS,
    });
    return res;
  } catch (err) {
    console.error("Admin session error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Logout: hapus cookie sesi admin.
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE_NAME, "", { ...cookieBase, maxAge: 0 });
  return res;
}
