import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Logo from '../img1/Logo.png';
import { authApi } from '../Api/Api';

const StaffForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      Swal.fire('Valid Email Required', 'Please enter your registered staff email address.', 'warning');
      return;
    }

    setLoading(true);

    try {
      await authApi.staffForgotPassword(email).catch(() => null);

      setLoading(false);
      setSubmitted(true);

      Swal.fire({
        icon: 'success',
        title: 'Staff Recovery Link Dispatched',
        html: `Password restoration steps have been sent to <b>${email}</b>. Please follow the instructions to regain access to the staff portal.`,
        confirmButtonColor: '#0b1e42',
      });
    } catch (error) {
      setLoading(false);
      setSubmitted(true);
      Swal.fire({
        icon: 'info',
        title: 'Request Dispatched',
        html: `If <b>${email}</b> belongs to a recognized faculty member, instructions have been generated.`,
        confirmButtonColor: '#0b1e42',
      });
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5 px-3"
      style={{
        backgroundColor: '#070f1e',
        minHeight: '85vh',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      }}
    >
      <div
        className="card border-0 shadow-lg w-100"
        style={{
          maxWidth: '440px',
          borderRadius: '18px',
          backgroundColor: '#0c172e',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="card-body p-4 p-md-5">
          {/* Logo & Header */}
          <div className="text-center mb-4">
            <Link to="/">
              <img
                src={Logo}
                alt="Logo"
                style={{ height: '46px', width: 'auto', marginBottom: '1rem' }}
              />
            </Link>
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <i className="bi bi-shield-lock"></i> Faculty Staff Recovery
            </div>
            <h3 className="fw-bold mb-1 text-white" style={{ letterSpacing: '-0.02em' }}>
              Reset Faculty Password
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Enter your official staff email address to receive authorization credentials.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-3">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: '56px',
                  height: '56px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  fontSize: '1.5rem',
                }}
              >
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <h5 className="fw-bold text-white mb-2">Instructions Sent</h5>
              <p className="small mb-4" style={{ color: '#94a3b8' }}>
                We have transmitted credentials reset instructions to <b>{email}</b>.
              </p>
              <button
                type="button"
                onClick={() => navigate('/Staff-Login')}
                className="btn btn-primary w-100 py-2 fw-semibold"
                style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5' }}
              >
                Return to Staff Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-white mb-1">
                  Official Staff Email
                </label>
                <div className="input-group">
                  <span className="input-group-text border-0" style={{ backgroundColor: '#142343', color: '#94a3b8' }}>
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control border-0 text-white shadow-none ps-1 py-2"
                    style={{ backgroundColor: '#142343', fontSize: '0.925rem' }}
                    placeholder="faculty@bharathithervukalam.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-2 fw-bold shadow-sm mt-3"
                style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5', fontSize: '0.95rem' }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Validating Staff Email...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-1"></i> Send Recovery Link
                  </>
                )}
              </button>

              <div className="text-center mt-4 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <span className="small" style={{ color: '#94a3b8' }}>Remember your password? </span>
                <Link to="/Staff-Login" className="small fw-bold text-info text-decoration-none">
                  Staff Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffForgotPassword;
