"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`toast toast-${type} ${visible ? "toast-in" : "toast-out"}`}
    >
      <span className="toast-icon">{type === "success" ? "✓" : "✕"}</span>
      <span className="toast-msg">{message}</span>

      <style>{`
        .toast {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 999;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          border-radius: 2px;
          backdrop-filter: blur(20px);
          font-family: 'Outfit', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          letter-spacing: 0.03em;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 40px rgba(0,0,0,0.5);
        }

        .toast-success {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
        }

        .toast-error {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .toast-in {
          opacity: 1;
          transform: translateY(0);
        }

        .toast-out {
          opacity: 0;
          transform: translateY(16px);
        }

        .toast-icon {
          font-size: 0.75rem;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .toast-success .toast-icon {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        .toast-error .toast-icon {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
        }
      `}</style>
    </div>
  );
}
