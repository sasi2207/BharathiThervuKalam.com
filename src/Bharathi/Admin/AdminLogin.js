import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Logo from '../img1/Logo.png';
import { authApi, setAuthToken } from '../Api/Api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  // 1. பழைய User / Student Session-ஐ உடனே Clear செய்யவும்
  localStorage.removeItem('token');
  localStorage.removeItem('user_token');
  localStorage.removeItem('admin_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user');

  try {
    const response = await authApi.adminLogin({ username, password });

    if (response.status === 200 && response.data?.token) {
      const { token, user } = response.data;

      // 2. புதிய Admin Token மற்றும் Role சேமிப்பு
      setAuthToken(token);
      localStorage.setItem('admin_token', token);
      
      const role = user?.role ? user.role.toUpperCase() : 'SUPER_ADMIN';
      localStorage.setItem('user_role', role);
      localStorage.setItem('user', JSON.stringify(user || { username, role }));

      Swal.fire({
        icon: 'success',
        title: 'Admin Authorized',
        text: 'Entering Management Control Center...',
        timer: 1200,
        showConfirmButton: false,
      });

      // 3. Admin பக்கத்திற்கு செல்லுதல்
      setTimeout(() => {
        window.location.href = '/Adm'; // React navigate-க்கு பதில் முழு பக்க reload நல்லது
      }, 1000);
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Invalid administrator credentials or unauthorized role.';

    Swal.fire({
      icon: 'error',
      title: 'Authorization Denied',
      text: errorMsg,
      confirmButtonColor: '#0a192f',
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="admin-login-wrapper py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="site-container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7">
            <div className="academic-card p-4 p-md-5 bg-white shadow-lg border">
              <div className="text-center mb-4">
                <img src={Logo} alt="Logo" style={{ height: '56px', width: 'auto' }} className="mb-3" />
                <h3 className="fw-bold mb-1">Administrative Control Center</h3>
                <p className="small text-muted mb-0">Bharathi Thervukalam · Master Management</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label-custom">Admin ID / Email</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter Admin Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label-custom">Master Password</label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control-custom"
                      placeholder="Enter Admin Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-link position-absolute end-0 top-50 translate-middle-y text-secondary text-decoration-none pe-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-custom w-100 py-2 fw-bold mt-2"
                >
                  {loading ? 'Authenticating...' : 'Sign In as Administrator'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;