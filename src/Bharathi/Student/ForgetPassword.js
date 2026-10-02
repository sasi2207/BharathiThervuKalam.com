import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import Swal
import { useSpring, animated } from 'react-spring'; // For animation


const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false); // For fade-in effect

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.get('https://www.bharathithervukalam.com/student/email', {
                params: { email }
            });
            setLoading(false);
            Swal.fire({
                title: 'Password Retrieved!',
                text: `Your password is: ${response.data}`,
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } catch (error) {
            setLoading(false);
            Swal.fire({
                title: 'Error',
                text: error.response ? error.response.data : 'An error occurred. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    // Fade-in effect for the form
    const formAnimation = useSpring({ opacity: 1, from: { opacity: 0 } });

    // UseEffect to handle the isLoaded state after component mounts
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <animated.div style={formAnimation} className={`login-container fade-in ${isLoaded ? 'visible' : ''}`}>
            <div className="login-box mt-5">
                <h2 className="text-center mb-4">Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Loading...' : 'Submit'}
                    </button>
                </form>
            </div>

            {/* Conditionally render loading spinner */}
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
        </animated.div>
    );
};

export default ForgotPassword;
