import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../img1/Logo.png';
import Swal from 'sweetalert2';

export default function StudentRegisterForm() {
  const [user, setUser] = useState({
    username: '',
    password: '',
    fatherName: '',
    dob: '',
    qualification: '',
    phoneNumber: '',
    whatsappNumber: '',
    fatherPhoneNumber: '',
    email: '',
    aadhaarNumber: '',
    caste: '',
    bloodGroup: '',
    typingSkills: '',
    sernoLanguage: '',
    sernoLevel: '',
    exServiceman: '',
    destitute: '',
    address: '',
    pstmtenth: false, // Changed to boolean
    pstmtowelth: false, // Changed to boolean
    pstmug: false, // Changed to boolean
    pstmpg: false, // Changed to boolean
    amount:500,
    tamilTyping: '',
    englishTyping: '',
    tamilStenoLevel: '',
    englishStenoLevel: ''
  });
  
  const [hasTamilTyping, setHasTamilTyping] = useState(false);
const [hasEnglishTyping, setHasEnglishTyping] = useState(false);
const [hasTamilSteno, setHasTamilSteno] = useState(false);
const [hasEnglishSteno, setHasEnglishSteno] = useState(false);


// Toggle Handlers
const handleToggleTamilTyping = () => setHasTamilTyping(!hasTamilTyping);
const handleToggleEnglishTyping = () => setHasEnglishTyping(!hasEnglishTyping);
const handleToggleTamilSteno = () => setHasTamilSteno(!hasTamilSteno);
const handleToggleEnglishSteno = () => setHasEnglishSteno(!hasEnglishSteno);


  const [hasTypingSkills, setHasTypingSkills] = useState(false);
  const [hasStenoSkills, setHasStenoSkills] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [aadhaarNumberError, setAadhaarNumberError] = useState('');
  
  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setUser(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value
    }));
};

 
 
 
  const [registrationError, setRegistrationError] = useState('');


  useEffect(() => {


    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadScript('https://checkout.razorpay.com/v1/checkout.js');
  }, []);

  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      const response = await axios.post('https://www.bharathithervukalam.com/student/register', {
        ...user,
        paymentId: paymentResponse.razorpay_payment_id,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Success:', response.data);

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'You have been registered successfully.',
        // footer: '<a href="#">Download PDF</a>'
      }).then(async () => {
        try {
          const pdfResponse = await axios.get("https://www.bharathithervukalam.com/exportToPDF", {
            responseType: 'blob',
          });

          const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `user_details_${new Date().toISOString()}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

        
        } catch (pdfError) {
          console.error('Error downloading PDF:', pdfError);
          Swal.fire('Error', 'Failed to download PDF. Please try again later.', 'error');
        }
      });
    } catch (error) {
      console.error('Error creating user:', error);
      handleRegistrationError(error);
    }
  };

  const handleRegistrationError = (error) => {
    if (error.response) {
      console.error('Response data:', error.response.data);

      if (error.response.status === 400) {
        const errorMessage = error.response.data;
        if (errorMessage.includes('Email already registered')) {
          setEmailError(errorMessage);
          Swal.fire('Error', 'Email is already registered. Please use a different email.', 'error');
        } else if (errorMessage.includes('Phone number already registered')) {
          setPhoneError(errorMessage);
          Swal.fire('Error', 'Phone number is already registered. Please use a different phone number.', 'error');
        } else if (errorMessage.includes('Student Registration limit reached')) {
          setRegistrationError(errorMessage);
          Swal.fire('Error', 'Registration limit reached. Please try again later.', 'error');
        } else if (errorMessage.includes('AadhaarNumber number already registered')) {
          setAadhaarNumberError(errorMessage);
          Swal.fire('Error', 'Aadhaar number is already registered. Please use a different Aadhaar number.', 'error');
        }
      } else if (error.response.status === 403) {
        Swal.fire('Error', 'User registration limit reached. Please try again later.', 'error');
      } else {
        Swal.fire('Error', 'Failed to register. Please try again later.', 'error');
      }
    } else if (error.request) {
      console.error('Request:', error.request);
      Swal.fire('Error', 'Failed to connect to the server. Please try again later.', 'error');
    } else {
      console.error('Error message:', error.message);
      Swal.fire('Error', 'An unexpected error occurred. Please try again later.', 'error');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
   

    
 

    const handlePayment = async () => {
      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        Swal.fire('Error', 'Razorpay SDK is not loaded. Please try again later.', 'error');
        return;
      }

      try {
        const response = await fetch("https://www.bharathithervukalam.com/payment/order", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ amount: 500 })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order ID');
        }

        const data = await response.json();

        const options = {
          key: "rzp_live_3bwnjafP09eVt8",
          amount: 500,
          currency: "INR",
          name: "Bharathi Thervu Kalam",
          description: "Test description",
          image: Logo,
          order_id: data.id,
          handler: function (response) {
            console.log(response.razorpay_payment_id);
            console.log(response.razorpay_order_id);
            console.log(response.razorpay_signature);

            Swal.fire({
              icon: 'success',
              title: 'Payment Successful!',
              text: 'Your payment was successful. Completing registration...',
              // footer: '<a href="#">View Details</a>'
            });

            handlePaymentSuccess(response);
          },
          notes: {
            address: "Razorpay Corporate Office"
          },
          theme: {
            color: "#3399cc"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          console.log(response.error);
          Swal.fire('Payment Failed', 'Your payment could not be completed. Please try again.', 'error');
        });
        rzp.open();
      } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Failed to initiate payment. Please try again later.', 'error');
      }
    };

    handlePayment();
  };



  const handleToggleTypingSkills = (e) => {
    setHasTypingSkills(e.target.checked);
    if (!e.target.checked) {
      setUser(prevState => ({
        ...prevState,
        typingSkills: ''
      }));
    }
  };

  const handleToggleStenoSkills = (e) => {
    setHasStenoSkills(e.target.checked);
    if (!e.target.checked) {
      setUser(prevState => ({
        ...prevState,
        sernoLanguage: '',
        sernoLevel: ''
      }));
    }
  };



  return (
    <div className="container mt-4">
    <h2 className="text-center mb-4">Student Registration Form</h2>
    <form onSubmit={handleSubmit}>
      <div className="row">
        {/* First Column */}
        <div className="col-lg-6 col-md-12 mb-3">
          <div className="row">
            <div className="col-12 mb-3">
              <label htmlFor="username" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="username"
                placeholder='Enter YourName'
                value={user.username}
                onChange={handleChange}
                required
              />
            </div>
  
            <div className="col-12 mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder='Create User Password'
                value={user.password}
                onChange={handleChange}
                required
              />
            </div>
  
            <div className="col-12 mb-3">
              <label htmlFor="fatherName" className="form-label">Father/Husband Name</label>
              <input
                type="text"
                className="form-control"
                name="fatherName"
                placeholder='Father/Husband Name'
                value={user.fatherName}
                onChange={handleChange}
                required
              />
            </div>
  
            <div className="col-12 mb-3">
              <label htmlFor="dob" className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                name="dob"
                value={user.dob}
                onChange={handleChange}
                required
              />
            </div>
  
            <div className="col-12 mb-3">
              <label htmlFor="qualification" className="form-label">Qualification</label>
              <input
                type="text"
                className="form-control"
                name="qualification"
                placeholder='Enter Your Qualification'
                value={user.qualification}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
  
        {/* Second Column */}
        <div className="col-lg-6 col-md-12 mb-3">
          <div className="row">
            <div className="col-12 mb-3">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                name="phoneNumber"
                placeholder='Enter Your Phone Number'
                value={user.phoneNumber}
                onChange={handleChange}
                required
              />
              {phoneError && <div className="text-danger mt-2">{phoneError}</div>}
            </div>
  
            <div className="col-12 mb-3">
              <label htmlFor="whatsappNumber" className="form-label">WhatsApp Number</label>
              <input
                type="tel"
                className="form-control"
                name="whatsappNumber"
                placeholder='Enter Your WhatsApp Number'
                value={user.whatsappNumber}
                onChange={handleChange}
                required
              />
            </div>
  
            <div className="col-12 mb-3">
              <label htmlFor="fatherPhoneNumber" className="form-label">Father/Husband Number</label>
              <input
                type="tel"
                className="form-control"
                name="fatherPhoneNumber"
                placeholder='Enter Your Father/Husband Number'
                value={user.fatherPhoneNumber}
                onChange={handleChange}
                required
              />
            </div>
  
            <div className="col-12 mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder='Enter Your Email ID'
                value={user.email}
                onChange={handleChange}
                required
              />
              {emailError && <div className="text-danger mt-2">{emailError}</div>}
            </div>
  
            <div className="col-12 mb-3">
              <label htmlFor="aadhaarNumber" className="form-label">Aadhaar Number</label>
              <input
                type="text"
                className="form-control"
                name="aadhaarNumber"
                placeholder='Enter Your Aadhaar Number'
                value={user.aadhaarNumber}
                onChange={handleChange}
                required
              />
              {aadhaarNumberError && <div className="text-danger mt-2">{aadhaarNumberError}</div>}
            </div>
          </div>
        </div>
  
        {/* Third Column */}
        <div className="col-lg-6 col-md-12 mb-3">
          <div className="row">
            <div className="col-12 mb-3">
              <label htmlFor="caste" className="form-label">Community</label>
              <select
                className="form-select"
                name="caste"
                value={user.caste}
                onChange={handleChange}
                required
              >
                <option value="">Select Community</option>
                <option value="oc">OC</option>
                <option value="bc">BC</option>
                <option value="BCM">BCM</option>
                <option value="MBC">MBC</option>
                <option value="sc">SC</option>
                <option value="SCA">SCA</option>
                <option value="st">ST</option>
              </select>
            </div>
  
            <div className="col-12 mb-3">
              <label htmlFor="bloodGroup" className="form-label">Blood Group</label>
              <select
                className="form-select"
                name="bloodGroup"
                value={user.bloodGroup}
                onChange={handleChange}
                required
              >
                <option value="">Select Blood Group</option>
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
  
            {/* Typing Skills */}
            <div className="col-12 mb-3">
  {/* Typing Skills Section */}
  <div className="form-check">
    <input
      type="checkbox"
      className="form-check-input"
      id="hasTypingSkills"
      checked={hasTypingSkills}
      onChange={handleToggleTypingSkills}
    />
    <label className="form-check-label" htmlFor="hasTypingSkills">Do you have Typing Skills?</label>
  </div>

  {hasTypingSkills && (
    <div className="mt-3">
      {/* Tamil Typing Skills */}
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="hasTamilTyping"
          checked={hasTamilTyping}
          onChange={handleToggleTamilTyping}
        />
        <label className="form-check-label" htmlFor="hasTamilTyping">Tamil Typing</label>
      </div>
      {hasTamilTyping && (
        <select
          className="form-select mt-2"
          name="tamilTyping"
          value={user.tamilTyping}
          onChange={handleChange}
        >
          <option value="">Select Tamil Typing Level</option>
          <option value="TamilLower">Tamil Lower</option>
          <option value="TamilHigher">Tamil Higher</option>
        </select>
      )}

      {/* English Typing Skills */}
      <div className="form-check mt-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="hasEnglishTyping"
          checked={hasEnglishTyping}
          onChange={handleToggleEnglishTyping}
        />
        <label className="form-check-label" htmlFor="hasEnglishTyping">English Typing</label>
      </div>
      {hasEnglishTyping && (
        <select
          className="form-select mt-2"
          name="englishTyping"
          value={user.englishTyping}
          onChange={handleChange}
        >
          <option value="">Select English Typing Level</option>
          <option value="EnglishLower">English Lower</option>
          <option value="EnglishHigher">English Higher</option>
        </select>
      )}
    </div>
  )}
</div>

{/* Steno Skills Section */}
<div className="col-12 mb-3">
  <div className="form-check">
    <input
      type="checkbox"
      className="form-check-input"
      id="hasStenoSkills"
      checked={hasStenoSkills}
      onChange={handleToggleStenoSkills}
    />
    <label className="form-check-label" htmlFor="hasStenoSkills">Do you have Steno Skills?</label>
  </div>

  {hasStenoSkills && (
    <div className="mt-3">
      {/* Tamil Steno Skills */}
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="hasTamilSteno"
          checked={hasTamilSteno}
          onChange={handleToggleTamilSteno}
        />
        <label className="form-check-label" htmlFor="hasTamilSteno">Tamil Steno</label>
      </div>
      {hasTamilSteno && (
        <>
          <select
            className="form-select mt-2"
            name="tamilStenoLevel"
            value={user.tamilStenoLevel}
            onChange={handleChange}
          >
            <option value="">Select Tamil Steno Level</option>
            <option value="Basic">Basic</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </>
      )}

      {/* English Steno Skills */}
      <div className="form-check mt-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="hasEnglishSteno"
          checked={hasEnglishSteno}
          onChange={handleToggleEnglishSteno}
        />
        <label className="form-check-label" htmlFor="hasEnglishSteno">English Steno</label>
      </div>
      {hasEnglishSteno && (
        <>
          <select
            className="form-select mt-2"
            name="englishStenoLevel"
            value={user.englishStenoLevel}
            onChange={handleChange}
          >
            <option value="">Select English Steno Level</option>
            <option value="Basic">Basic</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </>
      )}
    </div>
  )}
</div>

  
            <div className="col-12 mb-3">
              <label htmlFor="exServiceman" className="form-label">Ex-Serviceman</label>
              <select
                className="form-select"
                name="exServiceman"
                value={user.exServiceman}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>
  
        {/* Fourth Column */}
        <div className="col-lg-6 col-md-12 mb-3">
          <div className="row">
            <div className="col-12 mb-3">
              <label htmlFor="destitute" className="form-label">Destitute Widow</label>
              <select
                className="form-select"
                name="destitute"
                value={user.destitute}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
  
            <div className="col-12 mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                className="form-control"
                name="address"
                placeholder='Enter Your  Address'
                value={user.address}
                onChange={handleChange}
                required
              />
            </div>
  
            <div className="col-12 mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="pstmtenth"
                  name="pstmtenth"
                  checked={user.pstmtenth}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label htmlFor="pstmtenth" className="form-check-label">PSTM 10<sup>th</sup></label>
              </div>
            </div>
  
            <div className="col-12 mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="pstmtowelth"
                  name="pstmtowelth"
                  checked={user.pstmtowelth}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label htmlFor="pstmtowelth" className="form-check-label">PSTM 12<sup>th</sup></label>
              </div>
            </div>
  
            <div className="col-12 mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="pstmug"
                  name="pstmug"
                  checked={user.pstmug}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label htmlFor="pstmug" className="form-check-label">PSTM UG</label>
              </div>
            </div>
  
            <div className="col-12 mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="pstmpg"
                  name="pstmpg"
                  checked={user.pstmpg}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label htmlFor="pstmpg" className="form-check-label">PSTM PG</label>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div className="text-center mt-4">
        <button type="submit" className="btn btn-primary">Register</button>
      </div>
    </form>
  </div>
  
  
  
  );
}

