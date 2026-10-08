import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { motion } from 'framer-motion';

/**
 * ProtectedRoute Component Guard
 * Strictly enforces authentication and Role-Based Access Control (RBAC).
 *
 * Rules:
 * 1. Blocks unauthenticated users and redirects immediately to /login.
 * 2. Blocks users whose role is not included in `allowedRoles` (403 Forbidden UI).
 * 3. Preserves target location for post-login return.
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, role, loading, user, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Validating Security Tokens...</span>
        </div>
        <p className="text-secondary fw-semibold">Verifying JWT Session & Role Clearance...</p>
      </div>
    );
  }

  // 1. Authentication Guard: Must have active token and user session
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} state={{ from: location }} replace />;
  }

  // 2. Authorization Guard: Check if role has access to this route
  if (allowedRoles.length > 0) {
    const userRole = (role || '').toLowerCase().trim();
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase().trim());
    const isAuthorized = normalizedAllowed.includes(userRole);

    if (!isAuthorized) {
      return (
        <div className="container py-5 my-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="row justify-content-center"
          >
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                <div className="card-header bg-danger text-white py-3 px-4 d-flex align-items-center gap-3">
                  <i className="bi bi-shield-lock-fill fs-2"></i>
                  <div>
                    <h5 className="mb-0 fw-bold">403 Forbidden: Clearance Denied</h5>
                    <small className="text-white-50">Role-Based Access Control Enforcement</small>
                  </div>
                </div>
                <div className="card-body p-4 p-md-5 text-center">
                  <div className="display-1 text-danger mb-3">
                    <i className="bi bi-person-x-fill"></i>
                  </div>
                  <h4 className="fw-bold text-dark mb-2">Insufficient Permissions</h4>
                  <p className="text-muted mb-4">
                    Your current account <strong>{user?.username}</strong> is assigned the role{' '}
                    <span className="badge bg-secondary text-uppercase px-3 py-1 fs-6">{userRole}</span>.
                    This administrative sector requires one of the following clearances:
                  </p>

                  <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
                    {allowedRoles.map((r) => (
                      <span key={r} className="badge bg-danger-subtle text-danger border border-danger px-3 py-2 text-uppercase fw-bold">
                        <i className="bi bi-check2-circle me-1"></i>
                        {r}
                      </span>
                    ))}
                  </div>

                  <div className="d-grid gap-2">
                    {userRole === 'student' && (
                      <Link to="/student-dashboard" className="btn btn-primary py-2 fw-semibold">
                        <i className="bi bi-mortarboard me-2"></i> Go to Student Dashboard
                      </Link>
                    )}
                    {userRole === 'staff' && (
                      <Link to="/StaffDash" className="btn btn-primary py-2 fw-semibold">
                        <i className="bi bi-person-workspace me-2"></i> Go to Staff Workspace
                      </Link>
                    )}
                    {userRole === 'admin' && (
                      <Link to="/Adm" className="btn btn-primary py-2 fw-semibold">
                        <i className="bi bi-speedometer2 me-2"></i> Go to Admin Console
                      </Link>
                    )}
                    <button onClick={logout} className="btn btn-outline-danger py-2 fw-semibold">
                      <i className="bi bi-box-arrow-right me-2"></i> Log Out & Switch Account
                    </button>
                    <Link to="/" className="btn btn-link text-decoration-none text-muted">
                      Return to Homepage
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }
  }

  // User is authenticated and possesses the required role
  return children;
}
