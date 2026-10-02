import React, { useState } from 'react';
import { registerAdmin } from '../Api/Api';

const AdminRegistration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Dynamic Password Strength Calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 33, label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score: 66, label: 'Medium', color: '#f59e0b' };
    return { score: 100, label: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength(password);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (password.length < 6) {
      setStatus({
        type: 'error',
        text: 'Password must be at least 6 characters long.',
      });
      return;
    }

    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const data = await registerAdmin({
        username: username.trim(),
        password: password,
      });

      setStatus({
        type: 'success',
        text: typeof data === 'string' ? data : data?.message || 'Admin account created successfully!',
      });
      setUsername('');
      setPassword('');
    } catch (error) {
      const serverResponse = error.response?.data;
      const errorMsg =
        (typeof serverResponse === 'string' && serverResponse) ||
        serverResponse?.message ||
        serverResponse?.error ||
        error.message ||
        'Registration failed. Please check inputs and try again.';

      setStatus({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-3"
      style={{
        backgroundColor: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        className="card border-0 shadow-sm w-100"
        style={{
          maxWidth: '440px',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div className="card-body p-4 p-md-5">
          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
              style={{
                width: '52px',
                height: '52px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h4 className="fw-bold text-dark mb-1">Create Admin Account</h4>
            <p className="text-secondary small mb-0">Set up credentials with administrative privileges</p>
          </div>

          {/* Contextual Alert */}
          {status.text && (
            <div
              className={`alert alert-dismissible fade show d-flex align-items-center small py-2 px-3 mb-4 rounded-3 border-0 ${
                status.type === 'success'
                  ? 'bg-success-subtle text-success'
                  : 'bg-danger-subtle text-danger'
              }`}
              role="alert"
            >
              <span className="me-2">
                {status.type === 'success' ? (
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>
                ) : (
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                  </svg>
                )}
              </span>
              <div className="flex-grow-1">{status.text}</div>
              <button
                type="button"
                className="btn-close shadow-none p-2"
                onClick={() => setStatus({ type: '', text: '' })}
                aria-label="Close"
              />
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Username Input */}
            <div className="mb-3">
              <label htmlFor="admin-username" className="form-label small fw-semibold text-dark mb-1">
                Username
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  id="admin-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="e.g. admin_bharathi"
                  autoComplete="username"
                  disabled={loading}
                  className="form-control bg-light border-start-0 shadow-none ps-1 py-2"
                  style={{ fontSize: '0.925rem' }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-2">
              <label htmlFor="admin-password" className="form-label small fw-semibold text-dark mb-1">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="form-control bg-light border-start-0 border-end-0 shadow-none ps-1 py-2"
                  style={{ fontSize: '0.925rem' }}
                />
                <button
                  type="button"
                  className="btn bg-light border-start-0 border text-muted shadow-none px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>Strength</span>
                  <span className="fw-semibold" style={{ fontSize: '0.75rem', color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
                <div className="progress" style={{ height: '4px' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${strength.score}%`,
                      backgroundColor: strength.color,
                      transition: 'all 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}

            {!password && <div className="mb-4" />}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center shadow-sm"
              style={{
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                borderColor: '#2563eb',
                fontSize: '0.95rem',
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Creating Account...
                </>
              ) : (
                'Create Admin'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;