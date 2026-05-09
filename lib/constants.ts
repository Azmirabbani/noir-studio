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
