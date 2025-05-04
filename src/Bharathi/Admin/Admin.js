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
import axios from 'axios';

const AdminRegistration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://www.bharathithervukalam.com/admin/register', {
                username,
                password
            });
            setMessage(response.data);
        } catch (error) {
            setMessage(error.response ? error.response.data : 'An error occurred');
        }
    };

    return (
        <div className="container">
            <h2>Admin Registration</h2>
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminRegistration;
