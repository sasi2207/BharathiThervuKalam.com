import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AdminLogin.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  


  

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await axios.post(
            'https://www.bharathithervukalam.com/admin/login',
            { username, password },
            {
                headers: {
                    'Content-Type': 'application/json',
                    // Include 'Authorization' header if necessary
                },
            }
        );

        // Check the structure of your response
        console.log(response);
        
        if (response.status === 200) {
            const token = response.data.token; // Ensure this line is correct
            localStorage.setItem('authToken', token); // Storing the token

            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: response.data.message || 'You have logged in successfully.',
                timer: 1500,
                showConfirmButton: false,
            });
            navigate('/Adm');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: response.data.message || 'Invalid credentials.',
                timer: 1500,
                showConfirmButton: false,
            });
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        let errorMessage = error.response ? error.response.data.message : 'An unexpected error occurred.';
        
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: errorMessage,
            timer: 1500,
            showConfirmButton: false,
        });
    } finally {
        setLoading(false);
    }
};


  return (
    <div className={`login-container fade-in ${isLoaded ? 'visible' : ''}`}>
      <div className="login-box mt-5">
        <h2 className="text-center mb-4">Admin Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn btn-primary w-100">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
