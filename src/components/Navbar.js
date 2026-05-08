import React from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { LogOut, User, ShieldCheck } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const role = AuthService.getRole();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  return (
    <nav className="main-navbar">
      <div className="nav-brand">
        <ShieldCheck size={24} className="brand-icon" />
        <span className="brand-text">Academic Command</span>
      </div>

      <div className="nav-meta">
        <div className="user-badge">
          <User size={14} />
          <span>{role || 'Guest'}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      <style>{`
        .main-navbar {
          background: rgba(10, 10, 14, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon {
          color: var(--primary);
        }

        .brand-text {
          font-weight: 800;
          font-size: 18px;
          letter-spacing: -0.02em;
          color: var(--text-main);
          text-transform: uppercase;
        }

        .nav-meta {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .user-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          color: var(--text-dim);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          color: #ff4d4d;
          background: rgba(255, 77, 77, 0.05);
        }

        @media (max-width: 768px) {
          .main-navbar { padding: 0 20px; }
          .brand-text { display: none; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;