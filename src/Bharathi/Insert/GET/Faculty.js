import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { facultyApi } from '../../Api/Api';
import '../../Admin/AdminDashboard.css';

const FacultyForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [paper, setPaper] = useState('');
  const [subject, setSubject] = useState('');
  const [designation, setDesignation] = useState('Senior Faculty Mentor');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('TNPSC');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !subject.trim()) {
      Swal.fire('Required Fields', 'Please enter mentor name and subject expertise.', 'warning');
      return;
    }

    setLoading(true);
    const start = performance.now();

    const mentorData = {
      name: username.trim(),
      paper: paper.trim() || 'General Studies & Mains',
      subject: subject.trim(),
      designation: designation.trim(),
      phone: phone.trim() || '+91 7338757194',
      email: email.trim() || `${username.trim().toLowerCase().replace(/\s+/g, '')}@bharathi.com`,
      category: category || 'TNPSC',
    };

    try {
      // Real database POST API request
      const response = await facultyApi.create(mentorData);
      const duration = performance.now() - start;

      if (response.data && response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Faculty Inducted into Database!',
          text: `${username} successfully registered in database (${Number(duration.toFixed(2))}ms).`,
          showCancelButton: true,
          confirmButtonText: 'View Faculty Roster',
          cancelButtonText: 'Add Another',
          confirmButtonColor: '#0b1e42',
          cancelButtonColor: '#64748b',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/Faculty-View');
          } else {
            setUsername('');
            setPaper('');
            setSubject('');
            setPhone('');
            setEmail('');
          }
        });
      }
    } catch (err) {
      console.error('[Faculty Creation Error]', err);
      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: err.response?.data?.message || 'Database error while saving mentor.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        {/* Breadcrumb Navigation */}
        <nav className="admin-breadcrumb" aria-label="breadcrumb">
          <Link to="/Adm">Admin</Link>
          <span className="separator">/</span>
          <span>Faculty & Mentorship</span>
          <span className="separator">/</span>
          <span className="current">Faculty - Add</span>
        </nav>

        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <span className="admin-meta-badge" style={{ color: '#4f46e5' }}>
              <i className="bi bi-person-workspace"></i> Academic Mentors
            </span>
            <h1>Induct Faculty Mentor</h1>
            <p>Add distinguished educators and civil service officers to the database mentoring council.</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/Faculty-View" className="admin-btn-action edit py-2 px-3">
              <i className="bi bi-person-lines-fill me-1"></i> View Faculty Roster
            </Link>
          </div>
        </div>

        {/* Form Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="d-flex align-items-center gap-2">
              <span className="admin-stat-icon purple" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>
                <i className="bi bi-person-plus"></i>
              </span>
              <div>
                <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.98rem' }}>
                  Mentor Induction Form (POST /api/faculty)
                </h5>
                <span className="admin-counter-text">Direct Database Insertion</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="admin-form-group">
                  <label className="admin-form-label">Full Name & Credentials *</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    placeholder="e.g., Dr. S. Chakarvarthy, Ph.D."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="admin-form-group">
                  <label className="admin-form-label">Official Designation *</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    placeholder="e.g., Chief Mentor & State Service Specialist"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="admin-form-group">
                  <label className="admin-form-label">Papers Mentored *</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    placeholder="e.g., Paper II & III (Administration & Polity)"
                    value={paper}
                    onChange={(e) => setPaper(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="admin-form-group">
                  <label className="admin-form-label">Exam Wing / Category</label>
                  <select
                    className="admin-form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="TNPSC">TNPSC Civil Services</option>
                    <option value="TNUSRB">TNUSRB Uniformed Services</option>
                    <option value="GS">General Studies Foundation</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="admin-form-group">
                  <label className="admin-form-label">Contact Mobile</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    placeholder="+91 7338757194"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="admin-form-group">
                  <label className="admin-form-label">Official Email</label>
                  <input
                    type="email"
                    className="admin-form-control"
                    placeholder="mentor@bharathithervukalam.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="admin-form-group mb-0">
                  <label className="admin-form-label">Subject & Syllabus Areas *</label>
                  <textarea
                    rows="4"
                    className="admin-form-control"
                    placeholder="Specify subject coverage, reference materials, and evaluation strategy..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <Link to="/Faculty-View" className="btn btn-outline-secondary px-4">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn-primary-custom px-4 py-2"
                disabled={loading}
              >
                {loading ? 'Inserting into Database...' : 'Induct Mentor (POST)'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FacultyForm;
