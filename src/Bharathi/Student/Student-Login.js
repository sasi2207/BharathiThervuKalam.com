import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Logo from '../img1/Logo.png';
import { authApi, setAuthToken } from '../Api/Api';

const StudentLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputUser = username.trim();
    const inputPass = password.trim();

    if (!inputUser || !inputPass) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Credentials',
        text: 'Please enter both student username/roll number and password.',
        confirmButtonColor: '#0a192f'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.studentLogin({ username: inputUser, password: inputPass });
      const data = response?.data || {};
      const studentToken = data.token || data.access_token;

      if (!studentToken) {
        throw new Error('Authentication failed: No token returned from server.');
      }

      const studentUser = data.user || {
        username: data.username || inputUser,
        role: data.role || 'student',
        fullName: data.user?.fullName || data.user?.full_name || 'Enrolled Student',
        registerNo: data.user?.registerNo || data.user?.register_no || 'BTK2026-0428'
      };

      setAuthToken(studentToken);
      localStorage.setItem('token', studentToken);
      localStorage.setItem('access_token', studentToken);
      localStorage.setItem('user_token', studentToken);
      localStorage.setItem('user_role', 'student');
      localStorage.setItem('user', JSON.stringify(studentUser));

      Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: 'Login successful. Redirecting to student test portal...',
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => {
        navigate('/student-dashboard');
      }, 1200);
    } catch (error) {
      console.error('[StudentLogin] Authentication failure:', error);
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Invalid student ID/username or password.';

      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: errorMsg,
        confirmButtonColor: '#0a192f'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="site-container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="academic-card p-0 overflow-hidden shadow-lg border-0">
              <div className="row g-0">
                {/* Left Brand Panel */}
                <div 
                  className="col-12 col-md-5 p-4 p-md-5 text-white d-flex flex-column justify-content-between"
                  style={{ background: 'linear-gradient(135deg, var(--navy-950) 0%, var(--navy-800) 100%)' }}
                >
                  <div>
                    <img src={Logo} alt="Logo" style={{ height: '48px', width: 'auto' }} className="mb-3" />
                    <h5 className="fw-bold mb-1 tamil-text">பாரதி தேர்வுக்களம்</h5>
                    <p className="small text-warning text-uppercase fw-semibold mb-4">Student Portal</p>
                    <p className="small text-light opacity-75">
                      Access your weekly test marks, OMR evaluation report cards, study notes, and batch announcements.
                    </p>
                  </div>

                  <div className="small text-light opacity-50 pt-4 border-top border-secondary">
                    "வெற்றியின் முதல் படி !" · Est. 2017
                  </div>
                </div>

                {/* Right Form Panel */}
                <div className="col-12 col-md-7 p-4 p-md-5 bg-white">
                  <div className="mb-4">
                    <h3 className="fw-bold mb-1">Student Login</h3>
                    <p className="small text-muted mb-0">Enter your credentials to enter your account</p>
                  </div>

                  {/* Database Student Credential Helper Badge */}
                  <div className="alert alert-info py-2 px-3 d-flex align-items-center justify-content-between mb-4 border-0 rounded-3">
                    <div className="small">
                      <strong>Student Login:</strong> <code>student</code> | <strong>Password:</strong> <code>student123</code>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setUsername('student'); setPassword('student123'); }}
                      className="btn btn-sm btn-outline-primary py-1 px-2 fw-semibold"
                    >
                      Auto-Fill
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label-custom">Username or Roll Number</label>
                      <input 
                        type="text"
                        className="form-control-custom"
                        placeholder="e.g. BTK2026001"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label-custom mb-0">Password</label>
                        <Link to="/forgetpassword" className="small text-muted text-decoration-none">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="position-relative">
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          className="form-control-custom"
                          placeholder="Your Password"
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
                      {loading ? 'Authenticating...' : 'Sign In to Student Portal'}
                    </button>
                  </form>

                  <div className="border-top pt-3 mt-4 text-center small text-muted">
                    New student?{' '}
                    <Link to="/Student-Register" className="text-warning fw-semibold text-decoration-none">
                      Apply for Free Admission
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginForm;
