export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
}

export interface Booking {
  id: string;
  service_id: string;
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "bot";
  text: string;
  timestamp?: Date;
}

export interface ServiceMeta {
  icon: string;
  tagline: string;
  accent: string;
}
