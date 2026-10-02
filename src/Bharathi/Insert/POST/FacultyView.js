import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { facultyApi, DEFAULT_FACULTY } from '../../Api/Api';
import '../../Admin/AdminDashboard.css';

const FacultyView = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    paper: '',
    subject: '',
    designation: '',
    experience: '',
  });

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await facultyApi.getGroup1Faculty();
        if (Array.isArray(response.data) && response.data.length > 0) {
          setFacultyList(response.data);
        } else {
          setFacultyList(DEFAULT_FACULTY);
        }
      } catch (error) {
        setFacultyList(DEFAULT_FACULTY);
      }
    };

    fetchFaculty();
  }, []);

  const filteredFaculty = facultyList.filter((f) => {
    const q = searchTerm.toLowerCase();
    const name = (f.username || f.name || '').toLowerCase();
    const sub = (f.subject || '').toLowerCase();
    const paper = (f.paper || '').toLowerCase();
    const des = (f.designation || '').toLowerCase();
    return name.includes(q) || sub.includes(q) || paper.includes(q) || des.includes(q);
  });

  const handleOpenEdit = (faculty) => {
    setCurrentFaculty(faculty);
    setFormData({
      username: faculty.username || faculty.name || '',
      paper: faculty.paper || '',
      subject: faculty.subject || '',
      designation: faculty.designation || 'Academic Mentor',
      experience: faculty.experience || 'State Service Specialist',
    });
    setShowModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!currentFaculty) return;

    const updated = facultyList.map((f) =>
      f.id === currentFaculty.id ? { ...f, ...formData } : f
    );
    setFacultyList(updated);
    setShowModal(false);

    Swal.fire({
      icon: 'success',
      title: 'Updated',
      text: 'Faculty mentor information updated.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Remove Faculty Mentor?',
      text: `Are you sure you want to remove ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      setFacultyList(facultyList.filter((f) => f.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Removed',
        text: 'Faculty mentor record removed.',
        timer: 1400,
        showConfirmButton: false,
      });
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
          <span className="current">Faculty - View</span>
        </nav>

        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <span className="admin-meta-badge" style={{ color: '#4f46e5' }}>
              <i className="bi bi-person-workspace"></i> Chief Mentors & Officers
            </span>
            <h1>Faculty & Mentorship Council</h1>
            <p>Distinguished serving officers and expert educators mentoring Bharathi Thervukalam aspirants.</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/Staff" className="btn-primary-custom py-2 px-3">
              <i className="bi bi-person-plus me-1"></i> Add Faculty Mentor
            </Link>
          </div>
        </div>

        {/* Main Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="d-flex align-items-center gap-2">
              <span className="admin-stat-icon purple" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>
                <i className="bi bi-mortarboard"></i>
              </span>
              <div>
                <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.98rem' }}>
                  Mentor Profiles
                </h5>
                <span className="admin-counter-text">
                  Showing <b>{filteredFaculty.length}</b> mentors
                </span>
              </div>
            </div>

            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search faculty by name or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="admin-table-responsive">
            {filteredFaculty.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th style={{ width: '65px' }} className="text-center">Photo</th>
                    <th>Mentor & Designation</th>
                    <th>Papers Mentored</th>
                    <th>Subject Expertise</th>
                    <th>Phone / Guidance</th>
                    <th className="text-end" style={{ minWidth: '180px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.map((f, idx) => (
                    <tr key={f.id || idx}>
                      <td className="admin-id-col">#{idx + 1}</td>
                      <td className="text-center">
                        <div
                          className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold"
                          style={{
                            width: '42px',
                            height: '42px',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                            fontSize: '0.85rem',
                          }}
                        >
                          {(f.username || f.name || 'M')[0]}
                        </div>
                      </td>
                      <td>
                        <span className="admin-item-title">{f.username || f.name}</span>
                        <span className="admin-item-sub">{f.designation || 'Chief Mentor'}</span>
                      </td>
                      <td>
                        <span className="fw-semibold text-secondary">{f.paper || 'All Papers'}</span>
                      </td>
                      <td>
                        <span className="small text-muted">{f.subject}</span>
                      </td>
                      <td>
                        <span className="small fw-semibold text-dark">
                          {f.phone || f.phoneNumber || '+91 7338757194'}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="admin-action-btn-group">
                          <button
                            type="button"
                            className="admin-btn-action edit"
                            onClick={() => handleOpenEdit(f)}
                            title="Edit Faculty"
                          >
                            <i className="bi bi-pencil-square"></i> Edit
                          </button>
                          <button
                            type="button"
                            className="admin-btn-action delete"
                            onClick={() => handleDelete(f.id, f.username || f.name)}
                            title="Delete Faculty"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="admin-empty-state">
                <div className="admin-empty-icon">
                  <i className="bi bi-person-x"></i>
                </div>
                <h5 className="admin-empty-title">No Faculty Members Found</h5>
                <p className="admin-empty-desc">No faculty records matching your search query.</p>
                <Link to="/Staff" className="btn-primary-custom py-2 px-4">
                  <i className="bi bi-person-plus me-1"></i> Register Faculty Mentor
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Faculty Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="fw-bold" style={{ fontSize: '1.15rem' }}>
            <i className="bi bi-pencil-square text-primary me-2"></i>
            Edit Faculty Mentor
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSaveEdit}>
          <Modal.Body className="p-4">
            <div className="admin-form-group">
              <label className="admin-form-label">Mentor Name</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Designation</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Papers Assigned</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.paper}
                onChange={(e) => setFormData({ ...formData, paper: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group mb-0">
              <label className="admin-form-label">Subject & Syllabus Areas</label>
              <textarea
                rows="3"
                className="admin-form-control"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              ></textarea>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-top">
            <Button variant="light" onClick={() => setShowModal(false)} className="border">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="btn-primary-custom">
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default FacultyView;
