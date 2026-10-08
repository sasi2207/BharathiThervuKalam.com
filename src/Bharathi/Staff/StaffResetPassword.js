import React, { useState } from 'react';
import axios from 'axios';

const StaffResetPassword = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        try {
            const response = await axios.post('http://localhost:8080/reset-password', null, {
                params: { token, newPassword }
            });
            setMessage(response.data);
            setError('');
        } catch (error) {
            setError(error.response?.data || 'Something went wrong');
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your token"
            />
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
            />
            <button onClick={handleResetPassword}>Reset Password</button>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default StaffResetPassword;
