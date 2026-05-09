"use client";

import { useState, useEffect } from "react";
import ChatBox from "@/components/ChatBox";

interface FloatingChatProps {
  onOpenBooking?: (serviceId: string) => void;
}

export default function FloatingChat({ onOpenBooking }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0);

  // Dengerin event dari Navbar tombol "CHAT AI"
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("open-noir-chat", handler);
    return () => window.removeEventListener("open-noir-chat", handler);
  }, []);

  const closeChat = () => {
    setIsOpen(false);
    setChatKey((key) => key + 1);
  };

  return (
    <>
      <div id="chat" className="chat-anchor"></div>
      <style>{`
        .floating-chat-overlay {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .floating-chat-panel {
          width: 400px;
          max-height: calc(100vh - 48px);
          height: 560px;
          background: rgba(8, 6, 14, 0.97);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 4px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 32px 80px rgba(0,0,0,0.7),
            0 0 0 1px rgba(124,58,237,0.08),
            inset 0 1px 0 rgba(255,255,255,0.04);
          overflow: hidden;
          animation: panelIn 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: bottom right;
        }

        @keyframes panelIn {
          from {
            opacity: 0;
            transform: scale(0.88) translateY(16px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .floating-chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
        }

        .floating-chat-status {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .floating-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 10px rgba(16,185,129,0.6);
          animation: floatingStatusPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes floatingStatusPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(16,185,129,0.6); }
          50%       { opacity: 0.5; box-shadow: 0 0 4px rgba(16,185,129,0.2); }
        }

        .floating-status-text {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #6b7280;
        }

        .floating-close-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: #6b7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          transition: all 0.2s ease;
          line-height: 1;
          padding: 0;
        }

        .floating-close-btn:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.15);
          color: #f5f0eb;
        }

        .floating-chat-body {
          padding: 20px;
          height: calc(100% - 72px);
          display: flex;
          flex-direction: column;
        }

        /* ── Toggle button ── */
        .floating-toggle-btn {
          position: relative;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(124,58,237,0.9), rgba(88,28,135,0.95));
          border: 1px solid rgba(167,139,250,0.25);
          color: #ede9fe;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 8px 32px rgba(124,58,237,0.45),
            0 2px 8px rgba(0,0,0,0.4);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          font-size: 1.05rem;
          letter-spacing: 0;
        }

        .floating-toggle-btn::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(167,139,250,0.3), transparent 60%);
          pointer-events: none;
        }

        .floating-toggle-btn:hover {
          background: linear-gradient(135deg, rgba(139,92,246,1), rgba(109,40,217,1));
          box-shadow:
            0 12px 48px rgba(124,58,237,0.65),
            0 4px 12px rgba(0,0,0,0.5);
          transform: translateY(-3px) scale(1.05);
        }

        .floating-toggle-btn:active {
          transform: translateY(-1px) scale(0.98);
        }

        /* Ping animation saat closed */
        .floating-toggle-btn.is-closed::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid rgba(124,58,237,0.4);
          animation: floatingPing 2.5s ease-out infinite;
        }

        @keyframes floatingPing {
          0%   { transform: scale(1);    opacity: 0.7; }
          100% { transform: scale(1.5);  opacity: 0; }
        }

        @media (max-width: 480px) {
          .floating-chat-panel {
            width: calc(100vw - 32px);
          }
          .floating-chat-overlay {
            bottom: 16px;
            right: 16px;
          }
        }
      `}</style>

      <div className="floating-chat-overlay">
        {isOpen && (
          <div className="floating-chat-panel">
            <div className="floating-chat-header">
              <div className="floating-chat-status">
                <div className="floating-status-dot" />
                <span className="floating-status-text">NOIR AI · Online</span>
              </div>
              <button
                className="floating-close-btn"
                onClick={closeChat}
                aria-label="Tutup chat"
              >
                ✕
              </button>
            </div>
            <div className="floating-chat-body">
              <ChatBox key={chatKey} onOpenBooking={onOpenBooking} />
            </div>
          </div>
        )}

        <button
          className={`floating-toggle-btn ${isOpen ? "" : "is-closed"}`}
          onClick={() => {
            if (isOpen) {
              closeChat();
            } else {
              setIsOpen(true);
            }
          }}
          aria-label={isOpen ? "Tutup chat" : "Chat dengan AI"}
        >
          {isOpen ? "✕" : "✦"}
        </button>
      </div>
    </>
  );
}
