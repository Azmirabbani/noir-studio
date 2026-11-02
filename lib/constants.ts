import { ServiceMeta } from "@/types";

export const SERVICE_META: Record<string, ServiceMeta> = {
  Haircut: {
    icon: "✦",
    tagline: "Precision & style",
    accent: "#c084fc",
  },
  Facial: {
    icon: "◈",
    tagline: "Glow & renewal",
    accent: "#f472b6",
  },
  Massage: {
    icon: "◉",
    tagline: "Relax & restore",
    accent: "#67e8f9",
  },
};

export const DEFAULT_META: ServiceMeta = {
  icon: "✧",
  tagline: "Premium service",
  accent: "#a78bfa",
};

export const SALON_NAME = "NOIR";
export const SALON_TAGLINE = "Studio";
export const SALON_SUBTITLE = "Pengalaman premium, sentuhan eksklusif";

export const OPENING_HOURS = "Setiap hari, 10.00 – 21.00 WIB";

export interface Branch {
  id: string;
  name: string;
  area: string;
  mapQuery: string;
  note: string;
}

// Data contoh untuk keperluan portofolio. Lokasi sengaja hanya sampai tingkat jalan/area.
export const BRANCHES: Branch[] = [
  {
    id: "riau",
    name: "NOIR Riau",
    area: "Kawasan Jalan Riau, Bandung",
    mapQuery: "Jalan Riau, Bandung",
    note: "Dekat pusat kuliner dan perbelanjaan Bandung.",
  },
  {
    id: "braga",
    name: "NOIR Braga",
    area: "Kawasan Jalan Braga, Bandung",
    mapQuery: "Jalan Braga, Bandung",
    note: "Di kawasan bersejarah yang ramai dan mudah dijangkau.",
  },
  {
    id: "dago",
    name: "NOIR Dago",
    area: "Kawasan Dago, Bandung",
    mapQuery: "Jalan Ir. H. Juanda (Dago), Bandung",
    note: "Di kawasan sejuk Bandung utara.",
  },
];

export const SITE_DISCLAIMER =
  "Situs ini adalah proyek portofolio. Alamat, testimoni, dan angka pada halaman ini adalah data contoh.";
