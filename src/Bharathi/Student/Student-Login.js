import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const StudentLoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Password visibility toggle state
    const [isLoaded, setIsLoaded] = useState(false); // To trigger animation when loaded
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoaded(true); // Set the form as loaded to trigger fade-in animation
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('https://www.bharathithervukalam.com/student/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.text();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    text: 'You have successfully logged in. Redirecting...',
                });
                navigate('/Test-Series'); // Redirect after successful login
                setUsername(''); // Reset username input
                setPassword(''); // Reset password input
            } else {
                throw new Error(data); // If response is not OK, throw error
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.message || 'Login failed. Please check your credentials and try again.',
            });
            setErrorMessage(error.message || 'Login failed. Please check your credentials and try again.');
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`login-container  fade-in ${isLoaded ? 'visible' : ''}`}>
            <div className="login-box mt-5">
                <h2 className="text-center mb-4">Student Login</h2>
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
                    <div className="mt-3 text-center">
                        <Link to='/forgetpassword'>Forgot Password?</Link>
                    </div>
                    {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default StudentLoginForm;
