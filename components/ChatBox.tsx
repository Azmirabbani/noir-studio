"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "@/types";

interface Recommendation {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface ChatMessageWithRecommendation extends ChatMessage {
  recommendation?: Recommendation | null;
}

interface ChatBoxProps {
  onOpenBooking?: (serviceId: string) => void;
}

export default function ChatBox({ onOpenBooking }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessageWithRecommendation[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessageWithRecommendation = {
      role: "user",
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      let data: { reply?: string; recommendation?: Recommendation | null };
      try {
        data = await res.json();
      } catch {
        data = { reply: "Response tidak valid dari server." };
      }

      const botMsg: ChatMessageWithRecommendation = {
        role: "bot",
        text: data.reply ?? "Tidak ada respons.",
        timestamp: new Date(),
        recommendation: data.recommendation,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Koneksi gagal. Coba lagi ya." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) =>
    `Rp ${Number(price).toLocaleString("id-ID")}`;

  return (
    <div className="chatbox-root">
      <div className="chat-messages">
        {messages.length === 0 && !loading && (
          <div className="chat-empty">
            <span className="empty-icon">◈</span>
            <span>Tanyakan sesuatu atau langsung booking</span>
            <span className="empty-hint">"Saya ingin haircut besok jam 2"</span>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`msg-row ${m.role}`}>
            <div className="msg-avatar">{m.role === "user" ? "U" : "N"}</div>
            <div className="msg-content">
              <div className="msg-bubble">{m.text}</div>

              {m.role === "bot" && m.recommendation && (
                <div className="rec-card">
                  <div className="rec-info">
                    <span className="rec-name">{m.recommendation.name}</span>
                    <span className="rec-meta">
                      {m.recommendation.duration} menit ·{" "}
                      {formatPrice(m.recommendation.price)}
                    </span>
                  </div>
                  <button
                    className="rec-book-btn"
                    onClick={() => onOpenBooking?.(m.recommendation!.id)}
                  >
                    Book Now →
                  </button>
                </div>
              )}

              <span className="msg-time">{formatTime(m.timestamp)}</span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg-row bot">
            <div className="msg-avatar">N</div>
            <div className="msg-content">
              <div className="typing-bubble">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <input
          ref={inputRef}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ketik pesan kamu..."
          disabled={loading}
          autoComplete="off"
        />
        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <style>{`
        .chatbox-root {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .chat-messages {
          flex: 1;
          height: 320px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 4px 0 16px;
          scrollbar-width: thin;
          scrollbar-color: rgba(167,139,250,0.2) transparent;
        }

        .chat-messages::-webkit-scrollbar { width: 3px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(167,139,250,0.2);
          border-radius: 3px;
        }

        .chat-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 8px;
          color: #374151;
          text-align: center;
        }

        .empty-icon {
          font-size: 2rem;
          color: #4b5563;
          line-height: 1;
          margin-bottom: 4px;
        }

        .chat-empty span {
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 300;
          letter-spacing: 0.03em;
        }

        .empty-hint {
          font-style: italic;
          color: #4b5563 !important;
          font-size: 0.75rem !important;
          margin-top: 4px;
        }

        .msg-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          animation: msgIn 0.25s ease;
        }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .msg-row.user {
          flex-direction: row-reverse;
        }

        .msg-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 1px;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .msg-row.user .msg-avatar {
          background: rgba(124, 58, 237, 0.3);
          color: #c4b5fd;
        }

        .msg-row.bot .msg-avatar {
          background: rgba(167,139,250,0.08);
          color: #7c6fa0;
        }

        .msg-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 75%;
        }

        .msg-row.user .msg-content {
          align-items: flex-end;
        }

        .msg-bubble {
          padding: 10px 16px;
          border-radius: 2px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.875rem;
          font-weight: 300;
          line-height: 1.6;
        }

        .msg-row.user .msg-bubble {
          background: rgba(124, 58, 237, 0.25);
          border: 1px solid rgba(124, 58, 237, 0.3);
          color: #e9d5ff;
        }

        .msg-row.bot .msg-bubble {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          color: #d1d5db;
        }

        .msg-time {
          font-family: 'Outfit', sans-serif;
          font-size: 0.65rem;
          color: #374151;
          letter-spacing: 0.05em;
        }

        .typing-bubble {
          display: flex;
          gap: 5px;
          align-items: center;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 2px;
        }

        .typing-bubble span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4b5563;
          animation: typingDot 1.2s ease-in-out infinite;
        }

        .typing-bubble span:nth-child(2) { animation-delay: 0.2s; }
        .typing-bubble span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }

        .chat-input-row {
          display: flex;
          gap: 10px;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .chat-input {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          padding: 12px 16px;
          color: #f0ede8;
          font-family: 'Outfit', sans-serif;
          font-size: 0.875rem;
          font-weight: 300;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .chat-input::placeholder {
          color: #374151;
        }

        .chat-input:focus {
          border-color: rgba(124, 58, 237, 0.4);
        }

        .send-btn {
          width: 44px;
          height: 44px;
          border-radius: 2px;
          background: rgba(124, 58, 237, 0.2);
          border: 1px solid rgba(124, 58, 237, 0.3);
          color: #a78bfa;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .send-btn:hover:not(:disabled) {
          background: rgba(124, 58, 237, 0.4);
          border-color: rgba(124, 58, 237, 0.6);
          color: #e9d5ff;
        }

        .send-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .rec-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 8px;
          padding: 12px 16px;
          background: rgba(124, 58, 237, 0.08);
          border: 1px solid rgba(124, 58, 237, 0.2);
          border-radius: 2px;
          animation: msgIn 0.3s ease;
        }

        .rec-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .rec-name {
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: #e9d5ff;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .rec-meta {
          font-family: 'Outfit', sans-serif;
          font-size: 0.72rem;
          font-weight: 300;
          color: #7c6fa0;
        }

        .rec-book-btn {
          padding: 7px 14px;
          background: rgba(124, 58, 237, 0.25);
          border: 1px solid rgba(124, 58, 237, 0.4);
          border-radius: 2px;
          color: #c4b5fd;
          font-family: 'Outfit', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .rec-book-btn:hover {
          background: rgba(124, 58, 237, 0.45);
          border-color: rgba(124, 58, 237, 0.7);
          color: #ede9fe;
        }
      `}</style>
    </div>
  );
}
