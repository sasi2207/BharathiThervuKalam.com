import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const StaffRegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    dob: '',
    file: null,
    phoneNumber: '',
    whatsappNumber: '',
    email: '',
    bloodgroup: '',
    department: '',
    designation: '',
  });

  const [registrationCount, setRegistrationCount] = useState(0);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;

    if (type === 'file') {
      setFormData({ ...formData, file: files[0] }); // Handle file input
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Reset error messages on input change
    if (name === 'email') setEmailError('');
    if (name === 'phoneNumber') setPhoneError('');
    if (name === 'registrationError') setRegistrationError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (registrationCount >= 15) { // Update the limit to 15
      Swal.fire({
        icon: 'error',
        title: 'Registration Limit Reached',
        text: 'Registration limit reached. Only fifteen registrations are allowed.',
      });
      setRegistrationError('Registration limit reached. Only fifteen registrations are allowed.');
      return;
    }

    const form = new FormData();
    Object.keys(formData).forEach(key => {
      form.append(key, formData[key]);
    });

    setLoading(true); // Set loading to true when submission starts

    try {
      const response = await axios.post('https://www.bharathithervukalam.com/staff/register', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Success:', response.data);
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Registration successful.',
      });

      // Reset form fields after successful submission
      setFormData({
        username: '',
        password: '',
        dob: '',
        file: null,
        phoneNumber: '',
        whatsappNumber: '',
        email: '',
        bloodgroup: '',
        department: '',
        designation: '',
      });
      setRegistrationCount(prevCount => prevCount + 1); // Update registration count
    } catch (error) {
      handleErrors(error);
    } finally {
      setLoading(false); // Set loading to false when request completes
    }
  };

  const handleErrors = (error) => {
    if (error.response) {
      if (error.response.status === 400) {
        const errorMessage = error.response.data;
        if (errorMessage.includes('Email already registered')) {
          setEmailError(errorMessage);
          Swal.fire({
            icon: 'error',
            title: 'Email Already Registered',
            text: errorMessage,
          });
        } else if (errorMessage.includes('Phone number already registered')) {
          setPhoneError(errorMessage);
          Swal.fire({
            icon: 'error',
            title: 'Phone Number Already Registered',
            text: errorMessage,
          });
        } else if (errorMessage.includes('Student Registration limit reached')) {
          setRegistrationError(errorMessage);
          Swal.fire({
            icon: 'error',
            title: 'Registration Limit Reached',
            text: errorMessage,
          });
        }
      } else if (error.response.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'User Registration Limit Reached',
          text: 'User registration limit reached.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Failed to register. Please try again later.',
        });
      }
    } else if (error.request) {
      console.error('Request:', error.request);
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Failed to connect to the server. Please try again later.',
      });
    } else {
      console.error('Error message:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Unexpected Error',
        text: 'An unexpected error occurred. Please try again later.',
      });
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="mt-5">
        <h2 className="text-center">Staff Registration Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="row justify-content-center mt-5">
            {/* First Column */}
            <div className="col-md-6 col-lg-6">
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder='Enter Your Name'
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='mb-3'>
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder='Enter Your Password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="dob" className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phoneNumber"
                  placeholder='Enter Your Phone Number'
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
                {phoneError && <div className="text-danger">{phoneError}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="whatsappNumber" className="form-label">WhatsApp Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="whatsappNumber"
                  placeholder='Enter Your WhatsApp Number'
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Second Column */}
            <div className="col-md-6 col-lg-6">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder='Enter Your Email ID '
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {emailError && <div className="text-danger">{emailError}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="bloodgroup" className="form-label">Blood Group</label>
                <select
                  className="form-select form-select-lg"
                  name="bloodgroup"
                  value={formData.bloodgroup}
                  onChange={handleChange}
                  required
                >
                  <option value="">Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="department" className="form-label">Department</label>
                <input
                  type="text"
                  className="form-control"
                  name="department"
                  placeholder='Enter Your Department'
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="designation" className="form-label">Designation</label>
                <input
                  type="text"
                  className="form-control"
                  name="designation"
                  placeholder='Enter Your Designation'
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="file" className="form-label">Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="file"
                  placeholder='Upload Your Profile Image'
                  onChange={handleChange}
                  accept="image/*" // Restrict file types to images
                />
              </div>
            </div>
          </div>
          <div className="text-center mb-5 mt-5">
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>

        {registrationError && <div className="text-danger text-center mt-3">{registrationError}</div>}

        {/* Conditionally render loading animation */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffRegistrationForm;
