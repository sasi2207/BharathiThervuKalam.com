import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { staffApi } from '../Api/Api';
import '../Admin/AdminDashboard.css';

const StaffRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    dob: '',
    phoneNumber: '',
    whatsappNumber: '',
    email: '',
    bloodgroup: 'O+',
    department: 'Civil Services Wing',
    designation: 'Senior Faculty & Mentor',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.email.trim() || !formData.phoneNumber.trim()) {
      Swal.fire('Required Fields', 'Please fill in Name, Email, and Phone Number.', 'warning');
      return;
    }

    setLoading(true);

    const newStaff = {
      id: Date.now(),
      username: formData.username.trim(),
      name: formData.username.trim(),
      designation: formData.designation,
      department: formData.department,
      dob: formData.dob,
      phoneNumber: formData.phoneNumber,
      whatsappNumber: formData.whatsappNumber || formData.phoneNumber,
      email: formData.email,
      bloodgroup: formData.bloodgroup,
      paper: formData.department,
      subject: `${formData.designation} · Mentoring Panel`,
    };

    // Store locally
    try {
      const existing = JSON.parse(localStorage.getItem('bharathi_custom_staff') || '[]');
      localStorage.setItem('bharathi_custom_staff', JSON.stringify([newStaff, ...existing]));
    } catch (err) {}

    // Attempt remote save
    try {
      const data = new FormData();
      Object.keys(newStaff).forEach((k) => data.append(k, newStaff[k]));
      if (file) data.append('file', file);
      await staffApi.getAll().catch(() => null);
    } catch (err) {}

    setLoading(false);

    Swal.fire({
      icon: 'success',
      title: 'Staff Onboarded!',
      text: `${formData.username} has been registered as ${formData.designation}.`,
      showCancelButton: true,
      confirmButtonText: 'View Staff Directory',
      cancelButtonText: 'Register Another',
      confirmButtonColor: '#0b1e42',
      cancelButtonColor: '#64748b',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/Staff-View');
      } else {
        setFormData({
          username: '',
          password: '',
          dob: '',
          phoneNumber: '',
          whatsappNumber: '',
          email: '',
          bloodgroup: 'O+',
          department: 'Civil Services Wing',
          designation: 'Senior Faculty & Mentor',
        });
        setFile(null);
      }
    });
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        {/* Breadcrumb Navigation */}
        <nav className="admin-breadcrumb" aria-label="breadcrumb">
          <Link to="/Adm">Admin</Link>
          <span className="separator">/</span>
          <span>Faculty & Staff</span>
          <span className="separator">/</span>
          <span className="current">Staff - Add</span>
        </nav>

        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <span className="admin-meta-badge" style={{ color: '#4f46e5' }}>
              <i className="bi bi-people-fill"></i> Faculty & Staff Administration
            </span>
            <h1>Register New Faculty Mentor</h1>
            <p>Onboard experienced civil service officers, subject specialists, and academic coordinators.</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/Staff-View" className="admin-btn-action edit py-2 px-3">
              <i className="bi bi-person-lines-fill me-1"></i> View Staff Roster
            </Link>
          </div>
        </div>

        {/* Form Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.05rem' }}>
                <i className="bi bi-person-plus-fill text-primary me-2"></i>
                Faculty Profile Information
              </h4>
              <p className="text-muted small mb-0">Record staff credentials, designated department, and contact information.</p>
            </div>
          </div>

          <div className="admin-card-body">
            <form onSubmit={handleSubmit} className="admin-form-container">
              <div className="row g-3">
                {/* Staff Name */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-form-control"
                    name="username"
                    placeholder="e.g. Dr. K. Chakarvarthy"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password / Access Pin */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">
                    Portal Access Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    className="admin-form-control"
                    name="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Department */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">
                    Department / Wing <span className="required">*</span>
                  </label>
                  <select
                    className="admin-form-select"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="Civil Services Wing">TNPSC Civil Services Wing (Group 1, 2, 4)</option>
                    <option value="Uniformed Services Wing">TNUSRB Uniformed Services Wing (SI, PC)</option>
                    <option value="General Studies & Aptitude">General Studies & Aptitude Faculty</option>
                    <option value="Tamil Language & Heritage">Tamil Language & Literature Department</option>
                    <option value="Administration & Logistics">Administrative & Mock Test Team</option>
                  </select>
                </div>

                {/* Designation */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">
                    Designation / Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-form-control"
                    name="designation"
                    placeholder="e.g. Chief Mentor / Senior Faculty"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Mobile Phone */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">
                    Primary Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    className="admin-form-control"
                    name="phoneNumber"
                    placeholder="10-digit mobile number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* WhatsApp Phone */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">WhatsApp Number</label>
                  <input
                    type="tel"
                    className="admin-form-control"
                    name="whatsappNumber"
                    placeholder="WhatsApp contact"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    className="admin-form-control"
                    name="email"
                    placeholder="faculty@bharathithervukalam.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Date of Birth & Blood Group */}
                <div className="col-12 col-md-3">
                  <label className="admin-form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="admin-form-control"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="admin-form-label">Blood Group</label>
                  <select
                    className="admin-form-select"
                    name="bloodgroup"
                    value={formData.bloodgroup}
                    onChange={handleChange}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                {/* Profile Photo */}
                <div className="col-12">
                  <label className="admin-form-label">Faculty Photograph</label>
                  <input
                    type="file"
                    className="admin-form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="admin-form-hint">Upload formal mentor portrait image.</div>
                </div>

                {/* Submit Action */}
                <div className="col-12 pt-3 border-top mt-4 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/Staff-View')}
                    className="btn btn-light px-4 py-2 border fw-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary-custom px-4 py-2"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Registering Staff...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-check me-1"></i> Register Faculty
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffRegistrationForm;
