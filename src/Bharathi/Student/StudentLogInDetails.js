import React, { useState } from 'react';

const generateRegisterNo = () => {
  const a = "06";
  const b = new Date().getFullYear().toString();
  const c = nextIncrement();
  return a + b + c;
};

const nextIncrement = (() => {
  let counter = 0;
  return () => {
    counter++;
    return counter.toString().padStart(4, '0');
  };
})();

const StudentRegistrationForm = () => {
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
    pstm: { tenth: false, twelfth: false, ug: false, pg: false }
  });

  const [hasTypingSkills, setHasTypingSkills] = useState(false);
  const [hasStenoSkills, setHasStenoSkills] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [aadhaarNumberError, setAadhaarNumberError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setUser(prevUser => ({
        ...prevUser,
        pstm: { ...prevUser.pstm, [name.split('.')[1]]: checked }
      }));
    } else {
      setUser(prevUser => ({ ...prevUser, [name]: value }));
    }
  };

  const handleToggleTypingSkills = () => setHasTypingSkills(prev => !prev);
  const handleToggleStenoSkills = () => setHasStenoSkills(prev => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();
    const registrationNumber = generateRegisterNo();
    // Handle form submission logic here
    console.log('Form submitted with registration number:', registrationNumber);
  };

  return (
    <div className="container mt-3">
      <h2 className="text-center mb-4">Student Registration Form</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="row">
          {/* First Column */}
          <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Name</label>
              <input
                type="text"
                className="form-control form-control-lg"
                name="username"
                value={user.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                name="password"
                value={user.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="fatherName" className="form-label">Father/Husband Name</label>
              <input
                type="text"
                className="form-control form-control-lg"
                name="fatherName"
                value={user.fatherName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="dob" className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control form-control-lg"
                name="dob"
                value={user.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="qualification" className="form-label">Qualification</label>
              <input
                type="text"
                className="form-control form-control-lg"
                name="qualification"
                value={user.qualification}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Second Column */}
          <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control form-control-lg"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleChange}
                required
              />
              {phoneError && <div className="text-danger">{phoneError}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="whatsappNumber" className="form-label">WhatsApp Number</label>
              <input
                type="tel"
                className="form-control form-control-lg"
                name="whatsappNumber"
                value={user.whatsappNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="fatherPhoneNumber" className="form-label">Father/Husband Number</label>
              <input
                type="tel"
                className="form-control form-control-lg"
                name="fatherPhoneNumber"
                value={user.fatherPhoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
              {emailError && <div className="text-danger">{emailError}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="aadhaarNumber" className="form-label">Aadhaar Number</label>
              <input
                type="text"
                className="form-control form-control-lg"
                name="aadhaarNumber"
                value={user.aadhaarNumber}
                onChange={handleChange}
                required
              />
              {aadhaarNumberError && <div className="text-danger">{aadhaarNumberError}</div>}
            </div>
          </div>

          {/* Third Column */}
          <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
            <div className="mb-3">
              <label htmlFor="caste" className="form-label">Community</label>
              <select
                className="form-select form-select-lg"
                name="caste"
                value={user.caste}
                onChange={handleChange}
                required
              >
                <option value="">Community</option>
                <option value="oc">OC</option>
                <option value="bc">BC</option>
                <option value="BCM">BCM</option>
                <option value="MBC">MBC</option>
                <option value="sc">SC</option>
                <option value="SCA">SCA</option>
                <option value="st">ST</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="bloodGroup" className="form-label">Blood Group</label>
              <select
                className="form-select form-select-lg"
                name="bloodGroup"
                value={user.bloodGroup}
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

            {/* Typing Skills */}
            <div className="mb-3 form-check">
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
              <div className="mb-3">
                <label htmlFor="typingSkills" className="form-label">Typing Skills</label>
                <select
                  className="form-select form-select-lg"
                  name="typingSkills"
                  value={user.typingSkills}
                  onChange={handleChange}
                >
                  <option value="">Select Typing Skills</option>
                  <option value="tamilLower">Tamil Lower</option>
                  <option value="tamilHigher">Tamil Higher</option>
                  <option value="englishLower">English Lower</option>
                  <option value="englishHigher">English Higher</option>
                </select>
              </div>
            )}

            {/* Steno Skills */}
            <div className="mb-3 form-check">
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
              <div>
                <div className="mb-3">
                  <label htmlFor="sernoLanguage" className="form-label">Steno Language</label>
                  <select
                    className="form-select form-select-lg"
                    name="sernoLanguage"
                    value={user.sernoLanguage}
                    onChange={handleChange}
                  >
                    <option value="">Select Language</option>
                    <option value="tamilLower">Tamil</option>
                    <option value="englishLower">English</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="sernoLevel" className="form-label">Steno Level</label>
                  <select
                    className="form-select form-select-lg"
                    name="sernoLevel"
                    value={user.sernoLevel}
                    onChange={handleChange}
                  >
                    <option value="">Select Level</option>
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="exServiceman" className="form-label">Ex-Serviceman</label>
              <select
                className="form-select form-select-lg"
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

          {/* Fourth Column */}
          <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
            <div className="mb-3">
              <label htmlFor="destitute" className="form-label">Destitute</label>
              <select
                className="form-select form-select-lg"
                name="destitute"
                value={user.destitute}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                className="form-control form-control-lg"
                name="address"
                value={user.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">PSTM</label>
              {['tenth', 'twelfth', 'ug', 'pg'].map(level => (
                <div className="form-check" key={level}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name={`pstm.${level}`}
                    checked={user.pstm[level]}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">{level.toUpperCase()}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary">Register</button>
        </div>
      </form>
    </div>
  );
};

export default StudentRegistrationForm;
