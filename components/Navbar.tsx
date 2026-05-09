"use client";

import { useState, useEffect } from "react";
import { SALON_NAME, SALON_TAGLINE } from "@/lib/constants";

interface NavbarProps {
  onOpenBooking?: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const checkAdmin = () => {
      const adminCookie = document.cookie.includes("admin_auth=true");
      setIsAdmin(adminCookie);
    };

    window.addEventListener("scroll", handleScroll);
    checkAdmin();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-inner">
        <div className="navbar-logo">
          <span className="logo-main">{SALON_NAME}</span>
          <span className="logo-sub">{SALON_TAGLINE}</span>
        </div>

        <div className="navbar-links">
          <a href="#services">Services</a>
          <button onClick={onOpenBooking} className="nav-link-btn">
            Book Now
          </button>
          {isAdmin ? (
            <a href="/admin" className="nav-admin">
              Admin
            </a>
          ) : (
            <a href="/admin/login" className="nav-login">
              Admin Login
            </a>
          )}
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div
        className={`mobile-menu ${isMobileMenuOpen ? "mobile-menu-open" : ""}`}
      >
        <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>
          Services
        </a>
        <button
          onClick={() => {
            onOpenBooking?.();
            setIsMobileMenuOpen(false);
          }}
        >
          Book Now
        </button>
        {isAdmin ? (
          <a href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
            Admin
          </a>
        ) : (
          <a href="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
            Admin Login
          </a>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Outfit:wght@300;400;500;600&display=swap');

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 0 40px;
          height: 72px;
          display: flex;
          align-items: center;
          background: rgba(5, 5, 10, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: all 0.3s ease;
        }

        .navbar-scrolled {
          background: rgba(5, 5, 10, 0.9);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .navbar-inner {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-logo {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .logo-main {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #f5f0eb;
          letter-spacing: 6px;
          text-transform: uppercase;
          transition: color 0.3s ease;
        }

        .logo-sub {
          font-family: 'Outfit', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          color: #9ca3af;
          letter-spacing: 4px;
          text-transform: uppercase;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .navbar-links a,
        .nav-link-btn {
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #9ca3af;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          background: none;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
        }

        .navbar-links a:hover,
        .nav-link-btn:hover {
          color: #f5f0eb;
          background: rgba(255,255,255,0.05);
        }

        .nav-cta {
          padding: 8px 20px;
          border: 1px solid rgba(167,139,250,0.4);
          border-radius: 100px;
          color: #c4b5fd;
          background: transparent;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .nav-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(167,139,250,0.1), transparent);
          transition: left 0.5s ease;
        }

        .nav-cta:hover::before {
          left: 100%;
        }

        .nav-cta:hover {
          background: rgba(167,139,250,0.1);
          border-color: rgba(167,139,250,0.8);
          color: #e9d5ff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(167,139,250,0.2);
        }

        .nav-admin {
          color: #fbbf24 !important;
          font-weight: 500 !important;
        }

        .nav-admin:hover {
          background: rgba(251,191,36,0.1) !important;
          color: #fcd34d !important;
        }

        .nav-login {
          padding: 8px 20px !important;
          border: 1px solid rgba(167,139,250,0.4);
          border-radius: 100px;
          color: #c4b5fd !important;
          background: transparent;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          display: inline-block;
        }

        .nav-login::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(167,139,250,0.1), transparent);
          transition: left 0.5s ease;
        }

        .nav-login:hover::before {
          left: 100%;
        }

        .nav-login:hover {
          background: rgba(167,139,250,0.1) !important;
          border-color: rgba(167,139,250,0.8);
          color: #e9d5ff !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(167,139,250,0.2);
        }

        .mobile-menu-toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .mobile-menu-toggle span {
          width: 20px;
          height: 2px;
          background: #f5f0eb;
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .mobile-menu-toggle:hover span {
          background: #c4b5fd;
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(5, 5, 10, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          padding: 20px 40px;
        }

        .mobile-menu-open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu a,
        .mobile-menu button {
          display: block;
          width: 100%;
          text-align: left;
          padding: 12px 0;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #9ca3af;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .mobile-menu a:hover,
        .mobile-menu button:hover {
          color: #f5f0eb;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0 20px;
          }

          .navbar-links {
            display: none;
          }

          .mobile-menu-toggle {
            display: flex;
          }

          .mobile-menu {
            padding: 20px;
          }
        }
      `}</style>
    </nav>
  );
}
