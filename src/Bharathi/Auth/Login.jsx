import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { useAuth } from './AuthContext';
import Logo from '../img1/Logo.png';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user, logout } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username/email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const loggedUser = await login(username, password);

      Swal.fire({
        icon: 'success',
        title: 'Authentication Successful',
        text: `Welcome back, ${loggedUser.fullName || loggedUser.username}! Logged in as ${loggedUser.role.toUpperCase()}.`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect logic
      const searchParams = new URLSearchParams(location.search);
      const redirectUrl = searchParams.get('redirect') || location.state?.from?.pathname;

      if (redirectUrl) {
        navigate(redirectUrl, { replace: true });
      } else {
        if (loggedUser.role === 'admin') navigate('/Adm');
        else if (loggedUser.role === 'staff') navigate('/StaffDash');
        else navigate('/student-dashboard');
      }
    } catch (err) {
      console.error('[Login Error]', err);
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Invalid username or password. Please verify your credentials.';
      setErrorMsg(detail);
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: detail,
        confirmButtonColor: '#0b1e42',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5 px-3">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-100"
        style={{ maxWidth: '520px' }}
      >
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          {/* Header Banner */}
          <div className="p-4 text-center text-white" style={{ background: 'linear-gradient(135deg, #0b1a30 0%, #1e3a8a 100%)' }}>
            <img src={Logo} alt="Bharathi Academy" style={{ maxHeight: '60px' }} className="mb-2" />
            <h4 className="fw-bold mb-1">Bharathi Thervukalam</h4>
            <p className="text-white-50 small mb-0">Candidate & Faculty Portal Sign In</p>
          </div>

          <div className="card-body p-4 p-md-5">
            {/* If already authenticated, show current state banner */}
            {isAuthenticated && user && (
              <div className="alert alert-info border-0 rounded-3 d-flex align-items-center justify-content-between mb-4">
                <div>
                  <div className="fw-bold small">Currently signed in as:</div>
                  <strong>{user.username}</strong> ({user.role.toUpperCase()})
                </div>
                <button onClick={logout} className="btn btn-sm btn-outline-danger">
                  Log Out
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-exclamation-octagon-fill"></i>
                <div>{errorMsg}</div>
              </div>
            )}

            {/* Quick Demo Credential Helper */}
            <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded-3 border">
              <span className="small text-muted fw-semibold">Quick Login:</span>
              <div className="d-flex gap-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary py-0 px-2 fs-8"
                  onClick={() => { setUsername('student'); setPassword('student123'); }}
                >
                  Student
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary py-0 px-2 fs-8"
                  onClick={() => { setUsername('staff'); setPassword('staff123'); }}
                >
                  Staff
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary py-0 px-2 fs-8 fw-bold"
                  onClick={() => { setUsername('admin'); setPassword('admin123'); }}
                >
                  Admin
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">
                  Username, Email, or Register No.
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-secondary border-end-0">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="e.g. admin, staff, student, or BTK2026-0428"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-semibold text-dark mb-0">Password</label>
                  <Link to="/forgetpassword" className="small text-decoration-none text-muted">
                    Forgot Password?
                  </Link>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light text-secondary border-end-0">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0"
                    placeholder="Enter account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-dark w-100 py-2 fw-bold text-uppercase shadow-sm mb-3"
                style={{ backgroundColor: '#0b1a30', borderColor: '#0b1a30' }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Authenticating JWT...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i> Sign In to Portal
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <span className="text-muted small">Need an account? </span>
                <Link to="/Student-Register" className="small fw-bold text-primary text-decoration-none">
                  Register as Candidate
                </Link>
              </div>
              <div>
                <Link to="/Admin-Login" className="small fw-bold text-warning text-decoration-none">
                  <i className="bi bi-shield-lock me-1"></i> Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
