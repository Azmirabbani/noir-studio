export const ADMIN_COOKIE_NAME = "admin_auth";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 24;

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getKey(): Promise<CryptoKey | null> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/** Daftar email admin dari env ADMIN_EMAILS (dipisah koma). */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Membuat token sesi bertanda tangan. Mengembalikan null jika secret belum diatur. */
export async function createAdminSession(email: string): Promise<string | null> {
  const key = await getKey();
  if (!key) return null;

  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({
        sub: email,
        exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS,
      }),
    ),
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

/** Memverifikasi tanda tangan dan masa berlaku token. Null jika tidak valid. */
export async function verifyAdminSession(
  token: string | undefined,
): Promise<{ email: string } | null> {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;

  const key = await getKey();
  if (!key) return null;

  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(parts[1]),
      encoder.encode(parts[0]),
    );
    if (!valid) return null;

    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(parts[0]))) as {
      sub?: unknown;
      exp?: unknown;
    };
    if (typeof data.sub !== "string" || typeof data.exp !== "number") return null;
    if (data.exp < Math.floor(Date.now() / 1000)) return null;

    return { email: data.sub };
  } catch {
    return null;
  }
}
