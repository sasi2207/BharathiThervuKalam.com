import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminFooter() {
  return (
    <footer
      style={{
        background: '#061126',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1.25rem 2rem',
        fontSize: '0.8125rem',
        color: '#94a3b8',
      }}
    >
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 max-w-7xl mx-auto">
        <div>
          <span className="text-white fw-bold">பாரதி தேர்வுக்களம்</span> · Administrative Console & Management Panel
        </div>
        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="text-secondary text-decoration-none hover:text-white">
            <i className="bi bi-box-arrow-up-right me-1"></i> Public Website
          </Link>
          <span>·</span>
          <span>Helpline: +91 7338757194</span>
          <span>·</span>
          <span>Erode, Tamil Nadu</span>
        </div>
      </div>
    </footer>
  );
}
