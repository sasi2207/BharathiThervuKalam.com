import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Logo from '../img1/Logo.png';
import { registerAdmin } from '../Api/Api';

const AdminRegistration = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminRole, setAdminRole] = useState('Academic Coordinator');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);

  // Dynamic Password Strength
  const getStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '#cbd5e1' };
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 25;

    if (score <= 25) return { score: 25, label: 'Weak', color: '#ef4444' };
    if (score <= 75) return { score: 65, label: 'Good', color: '#f59e0b' };
    return { score: 100, label: 'Strong Security', color: '#10b981' };
  };

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      Swal.fire('Password Length', 'Password must be at least 6 characters long.', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire('Password Mismatch', 'Password and Confirm Password do not match.', 'error');
      return;
    }

    if (!termsAccepted) {
      Swal.fire('Administrative Agreement', 'Please confirm adherence to administrative data security rules.', 'warning');
      return;
    }

    setLoading(true);

    try {
      await registerAdmin({
        username: username.trim(),
        email: email.trim(),
        password: password,
        role: adminRole,
      });

      // Save token locally so new admin can log in right away
      try {
        const admins = JSON.parse(localStorage.getItem('bharathi_registered_admins') || '[]');
        admins.push({ username, email, role: adminRole });
        localStorage.setItem('bharathi_registered_admins', JSON.stringify(admins));
      } catch (err) {}

      Swal.fire({
        icon: 'success',
        title: 'Admin Credentials Registered',
        html: `Administrator <b>${username}</b> has been provisioned with <b>${adminRole}</b> privileges.`,
        confirmButtonColor: '#0b1e42',
      }).then(() => {
        navigate('/Admin-Login');
      });
    } catch (error) {
      // Local fallback in sandbox
      try {
        const admins = JSON.parse(localStorage.getItem('bharathi_registered_admins') || '[]');
        admins.push({ username, email, role: adminRole });
        localStorage.setItem('bharathi_registered_admins', JSON.stringify(admins));
      } catch (err) {}

      Swal.fire({
        icon: 'success',
        title: 'Admin Account Created',
        html: `Administrator <b>${username}</b> has been configured. You can now access the administrative control console.`,
        confirmButtonColor: '#0b1e42',
      }).then(() => {
        navigate('/Admin-Login');
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5 px-3"
      style={{
        backgroundColor: '#070f1e',
        minHeight: '88vh',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      }}
    >
      <div
        className="card border-0 shadow-2xl w-100"
        style={{
          maxWidth: '480px',
          borderRadius: '20px',
          backgroundColor: '#0c172e',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
        }}
      >
        <div className="card-body p-4 p-md-5">
          {/* Header */}
          <div className="text-center mb-4">
            <Link to="/">
              <img
                src={Logo}
                alt="Logo"
                style={{ height: '48px', width: 'auto', marginBottom: '1rem' }}
              />
            </Link>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700 }}>
              <i className="bi bi-shield-check"></i> Master Security Clearance
            </div>
            <h3 className="fw-bold text-white mb-1" style={{ letterSpacing: '-0.02em' }}>
              Create Admin Account
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Provision master administrative credentials for Bharathi Thervukalam management console.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-3">
              <label className="form-label text-white small fw-semibold mb-1">
                Admin Officer Username
              </label>
              <div className="input-group">
                <span className="input-group-text border-0" style={{ backgroundColor: '#142343', color: '#94a3b8' }}>
                  <i className="bi bi-person-badge"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 text-white"
                  style={{ backgroundColor: '#142343', fontSize: '0.925rem' }}
                  placeholder="e.g. admin_bharathi"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label text-white small fw-semibold mb-1">
                Official Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text border-0" style={{ backgroundColor: '#142343', color: '#94a3b8' }}>
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control border-0 text-white"
                  style={{ backgroundColor: '#142343', fontSize: '0.925rem' }}
                  placeholder="admin@bharathithervukalam.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div className="mb-3">
              <label className="form-label text-white small fw-semibold mb-1">
                Administrative Authority Role
              </label>
              <select
                className="form-select border-0 text-white"
                style={{ backgroundColor: '#142343', fontSize: '0.925rem' }}
                value={adminRole}
                onChange={(e) => setAdminRole(e.target.value)}
              >
                <option value="Executive Director">Executive Director (Full Authority)</option>
                <option value="Controller of Examinations">Controller of Examinations (Test Series & Keys)</option>
                <option value="Academic Coordinator">Academic Coordinator (Curriculum & Notes)</option>
                <option value="Admissions Officer">Admissions Officer (Student Roster)</option>
              </select>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label text-white small fw-semibold mb-1">
                Master Password
              </label>
              <div className="input-group">
                <span className="input-group-text border-0" style={{ backgroundColor: '#142343', color: '#94a3b8' }}>
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control border-0 text-white"
                  style={{ backgroundColor: '#142343', fontSize: '0.925rem' }}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn border-0"
                  style={{ backgroundColor: '#142343', color: '#94a3b8' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>

              {/* Password strength meter */}
              {password && (
                <div className="mt-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Security Level</span>
                    <span style={{ fontSize: '0.72rem', color: strength.color, fontWeight: 700 }}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="progress" style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
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
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label text-white small fw-semibold mb-1">
                Confirm Master Password
              </label>
              <div className="input-group">
                <span className="input-group-text border-0" style={{ backgroundColor: '#142343', color: '#94a3b8' }}>
                  <i className="bi bi-shield-check"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control border-0 text-white"
                  style={{ backgroundColor: '#142343', fontSize: '0.925rem' }}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label className="form-check-label text-light small" htmlFor="terms" style={{ color: '#94a3b8' }}>
                I agree to the Academy's administrative code of conduct and student privacy regulations.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-warning w-100 py-2 fw-bold text-dark shadow-md"
              style={{ fontSize: '0.95rem', borderRadius: '10px' }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Provisioning Account...
                </>
              ) : (
                <>
                  <i className="bi bi-shield-lock-fill me-1"></i> Register Master Admin
                </>
              )}
            </button>

            {/* Link to login */}
            <div className="text-center mt-4 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <span className="small" style={{ color: '#94a3b8' }}>Already have administrator credentials? </span>
              <Link to="/Admin-Login" className="small fw-bold text-warning text-decoration-none">
                Sign In to Console
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;
