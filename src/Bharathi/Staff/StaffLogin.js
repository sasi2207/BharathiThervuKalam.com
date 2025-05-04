import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './StaffLogin.css'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const StaffLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Add showPassword state

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true); 
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true); // Set loading to true when submission starts

    try {
      const response = await fetch('https://www.bharathithervukalam.com/staff/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.text();

      if (response.ok) {
        console.log('Login successful:', data);
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Staff Login Successful',
        }).then(() => {
          navigate('/StaffDash');
        });
        setUsername('');
        setPassword('');
      } else {
        throw new Error(data);
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Login failed. Please check your credentials and try again.',
      });
    } finally {
      setLoading(false); // Set loading to false when request completes
    }
  };

  return (
    <div className={`login-container fade-in ${isLoaded ? 'visible' : ''}`}>
      <div className="login-box mt-5">
        <h2 className="text-center mb-4">Staff Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder='Enter UserName'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3 password-field">
            <label htmlFor="password">Password:</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-control"
                placeholder='Enter Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="input-group-append">
                <span className="input-group-text" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
          {/* <Link to='/forget-staffpassword'>Forgot Password?</Link> */}
          
          {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
        </form>
      </div>

      {/* Conditionally render loading animation */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default StaffLogin;
