"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        document.cookie = "admin_auth=true; path=/; max-age=86400";
        window.location.href = "/admin";
      }
    } catch (err) {
      setError("Login gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login" className="login-page">
      <div className="login-container">
        <div className="login-header">
          <span className="login-label">Admin Login</span>
          <h1 className="login-title">NOIR Studio Admin</h1>
          <p className="login-description">
            Masukkan kredensial admin untuk mengakses dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@noirstudio.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #05050a;
          color: #f5f0eb;
          font-family: 'Outfit', sans-serif;
          padding: 24px;
        }

        .login-container {
          max-width: 400px;
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 32px;
          backdrop-filter: blur(10px);
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-label {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a78bfa;
          margin-bottom: 14px;
        }

        .login-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          margin-bottom: 16px;
          line-height: 1.05;
        }

        .login-description {
          font-size: 0.95rem;
          font-weight: 300;
          color: #9ca3af;
          line-height: 1.75;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9ca3af;
        }

        .form-input {
          padding: 12px 14px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: #f5f0eb;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-input:focus {
          border-color: rgba(167,139,250,0.5);
        }

        .login-error {
          padding: 12px 14px;
          border-radius: 8px;
          background: rgba(220, 38, 38, 0.12);
          color: #fed7d7;
          border: 1px solid rgba(248, 113, 113, 0.2);
          font-size: 0.9rem;
        }

        .login-btn {
          padding: 14px 20px;
          border: none;
          border-radius: 8px;
          background: #a78bfa;
          color: #0f172a;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
