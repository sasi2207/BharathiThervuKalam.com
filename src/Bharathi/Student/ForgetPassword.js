import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Logo from '../img1/Logo.png';
import { authApi } from '../Api/Api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      Swal.fire('Valid Email Required', 'Please enter your registered student email address.', 'warning');
      return;
    }

    setLoading(true);

    try {
      await authApi.studentForgotPassword(email).catch(() => null);

      setLoading(false);
      setSubmitted(true);

      Swal.fire({
        icon: 'success',
        title: 'Recovery Instructions Dispatched',
        html: `Password reset instructions have been dispatched to <b>${email}</b>.<br/><small className="text-muted">If you don't see it, please check your spam folder or contact academy coordinator at +91 7338757194.</small>`,
        confirmButtonColor: '#0b1e42',
      });
    } catch (error) {
      setLoading(false);
      setSubmitted(true);
      Swal.fire({
        icon: 'info',
        title: 'Recovery Request Received',
        html: `If an account exists for <b>${email}</b>, an email has been sent with steps to restore access.`,
        confirmButtonColor: '#0b1e42',
      });
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5 px-3"
      style={{
        backgroundColor: '#f4f7fb',
        minHeight: '85vh',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      }}
    >
      <div
        className="card border-0 shadow-lg w-100"
        style={{
          maxWidth: '440px',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 30px -5px rgba(11, 30, 66, 0.08)',
        }}
      >
        <div className="card-body p-4 p-md-5">
          {/* Logo & Header */}
          <div className="text-center mb-4">
            <Link to="/">
              <img
                src={Logo}
                alt="Logo"
                style={{ height: '48px', width: 'auto', marginBottom: '1rem' }}
              />
            </Link>
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
              style={{
                background: '#eff6ff',
                color: '#2563eb',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              <i className="bi bi-key-fill"></i> Candidate Portal Recovery
            </div>
            <h3 className="fw-bold mb-1" style={{ color: '#061126', letterSpacing: '-0.02em' }}>
              Reset Student Password
            </h3>
            <p className="text-muted small mb-0">
              Enter your registered email address to receive password retrieval instructions.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-3">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{ width: '56px', height: '56px', background: '#ecfdf5', color: '#059669', fontSize: '1.5rem' }}
              >
                <i className="bi bi-envelope-check-fill"></i>
              </div>
              <h5 className="fw-bold text-dark mb-2">Check Your Inbox</h5>
              <p className="small text-muted mb-4">
                We sent a password recovery link to <b>{email}</b>. Follow the link inside to set a new password.
              </p>
              <button
                type="button"
                onClick={() => navigate('/Student-Login')}
                className="btn-primary-custom w-100 py-2"
              >
                Return to Student Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark mb-1">
                  Registered Email Address <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control bg-light border-start-0 shadow-none ps-1 py-2"
                    style={{ fontSize: '0.925rem' }}
                    placeholder="e.g. student@gmail.com"
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
                className="btn-primary-custom w-100 py-2 fw-bold shadow-sm mt-3"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Locating Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-1"></i> Send Recovery Link
                  </>
                )}
              </button>

              <div className="text-center mt-4 pt-3 border-top">
                <span className="small text-muted">Remembered your credentials? </span>
                <Link to="/Student-Login" className="small fw-bold text-primary text-decoration-none">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
