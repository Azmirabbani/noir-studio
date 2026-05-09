import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOIR Studio — Premium Grooming Experience",
  description:
    "Layanan grooming premium dengan pengalaman eksklusif. Book online sekarang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
