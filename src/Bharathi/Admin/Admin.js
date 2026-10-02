// import React, { useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// const AdminRegistration = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('https://www.bharathithervukalam.com/admin/register', {
//         username: username,
//         password: password,
//       });
//       console.log(response.data); // Handle success response

//       // Use Swal.fire for success message
//       Swal.fire({
//         icon: 'success',
//         title: 'Registration Successful',
//         text: 'Admin registered successfully.',
//       });

//       // Optionally, redirect to the login page or handle navigation
//       setUsername('');
//       setPassword('');
//       setErrorMessage('');
//     } catch (error) {
//       console.error('Error registering admin:', error);

//       // Use Swal.fire for error message
//       Swal.fire({
//         icon: 'error',
//         title: 'Registration Failed',
//         text: 'Failed to register admin. Please try again.',
//       });
//       setErrorMessage('Failed to register admin.');
//     }
//   };

//   return (
//     <div className="container my-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6 col-lg-4">
//           <h2 className="text-center mb-4">Admin Registration</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group mb-3">
//               <label htmlFor="username">Username:</label>
//               <input
//                 type="text"
//                 id="username"
//                 className="form-control"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="form-group mb-3">
//               <label htmlFor="password">Password:</label>
//               <input
//                 type="password"
//                 id="password"
//                 className="form-control"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <button type="submit" className="btn btn-primary w-100">Register</button>
//             {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminRegistration;


import React, { useState } from 'react';
import { registerAdmin } from '../Api/Api';

const AdminRegistration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = await registerAdmin  ({ username, password });
      
      setIsSuccess(true);
      setMessage(typeof data === 'string' ? data : data.message || 'Registration successful!');
      setUsername('');
      setPassword('');
    } catch (error) {
      setIsSuccess(false);
      const errorMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === 'string' ? error.response.data : null) ||
        'Registration failed. Please check your network and inputs.';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '480px' }}>
      <h2 className="mb-4 fw-bold">Admin Registration</h2>
      
      {message && (
        <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'} mb-3`} role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div className="form-group mb-3">
          <label htmlFor="username" className="form-label fw-semibold">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-control"
            placeholder="Enter username"
            disabled={loading}
          />
        </div>

        <div className="form-group mb-4">
          <label htmlFor="password" className="form-label fw-semibold">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
            placeholder="Enter password"
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100 py-2 fw-semibold"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default AdminRegistration;