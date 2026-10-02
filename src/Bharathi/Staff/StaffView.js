import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { staffApi, DEFAULT_FACULTY } from '../Api/Api';
import '../Admin/AdminDashboard.css';

const StaffView = () => {
  const [staffData, setStaffData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    designation: '',
    department: '',
    phoneNumber: '',
    whatsappNumber: '',
    email: '',
    bloodgroup: '',
  });

  useEffect(() => {
    const fetchStaff = async () => {
      let custom = [];
      try {
        custom = JSON.parse(localStorage.getItem('bharathi_custom_staff') || '[]');
      } catch (e) {}

      let apiList = [];
      try {
        const response = await staffApi.getAll();
        if (Array.isArray(response.data) && response.data.length > 0) {
          apiList = response.data;
        } else {
          apiList = DEFAULT_FACULTY;
        }
      } catch (err) {
        apiList = DEFAULT_FACULTY;
      }

      const combined = [...custom, ...apiList].map((s) => ({
        ...s,
        displayName: s.username || s.name || 'Faculty Member',
        displayDesignation: s.designation || 'Senior Faculty Mentor',
        displayDept: s.department || s.subject || 'Competitive Exams Panel',
        displayPhone: s.phoneNumber || s.phone || '+91 7338757194',
      }));

      const seen = new Set();
      const unique = combined.filter((s) => {
        if (!s || seen.has(s.id)) return false;
        seen.add(s.id);
        return true;
      });

      setStaffData(unique);
    };

    fetchStaff();
  }, []);

  const filteredStaff = staffData.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      (s.displayName && s.displayName.toLowerCase().includes(q)) ||
      (s.displayDesignation && s.displayDesignation.toLowerCase().includes(q)) ||
      (s.displayDept && s.displayDept.toLowerCase().includes(q)) ||
      (s.displayPhone && s.displayPhone.includes(q))
    );
  });

  const handleOpenEdit = (staff) => {
    setCurrentStaff(staff);
    setFormData({
      username: staff.displayName,
      designation: staff.displayDesignation,
      department: staff.displayDept,
      phoneNumber: staff.displayPhone,
      whatsappNumber: staff.whatsappNumber || staff.displayPhone,
      email: staff.email || 'faculty@bharathithervukalam.com',
      bloodgroup: staff.bloodgroup || 'O+',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!currentStaff) return;

    const updated = staffData.map((s) =>
      s.id === currentStaff.id
        ? {
            ...s,
            displayName: formData.username,
            username: formData.username,
            displayDesignation: formData.designation,
            designation: formData.designation,
            displayDept: formData.department,
            department: formData.department,
            displayPhone: formData.phoneNumber,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            bloodgroup: formData.bloodgroup,
          }
        : s
    );

    setStaffData(updated);
    setShowEditModal(false);

    try {
      localStorage.setItem('bharathi_custom_staff', JSON.stringify(updated));
    } catch (e) {}

    Swal.fire({
      icon: 'success',
      title: 'Updated',
      text: 'Staff member details updated.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleDelete = async (id, name) => {
    const res = await Swal.fire({
      title: 'Remove Staff Record?',
      text: `Are you sure you want to remove ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
    });

    if (res.isConfirmed) {
      const updated = staffData.filter((s) => s.id !== id);
      setStaffData(updated);
      try {
        localStorage.setItem('bharathi_custom_staff', JSON.stringify(updated));
      } catch (e) {}

      Swal.fire({
        icon: 'success',
        title: 'Removed',
        text: 'Staff member removed.',
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
          <span>Faculty & Staff</span>
          <span className="separator">/</span>
          <span className="current">Staff - View</span>
        </nav>

        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <span className="admin-meta-badge" style={{ color: '#4f46e5' }}>
              <i className="bi bi-people-fill"></i> Faculty & Staff Panel
            </span>
            <h1>Academic Staff & Faculty Roster</h1>
            <p>Directory of serving officers, chief mentors, test series coordinators, and subject specialists.</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/Staff" className="btn-primary-custom py-2 px-3">
              <i className="bi bi-person-plus me-1"></i> Add New Staff Member
            </Link>
          </div>
        </div>

        {/* Main Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="d-flex align-items-center gap-2">
              <span className="admin-stat-icon purple" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>
                <i className="bi bi-person-lines-fill"></i>
              </span>
              <div>
                <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.98rem' }}>
                  Faculty Members
                </h5>
                <span className="admin-counter-text">
                  Showing <b>{filteredStaff.length}</b> active members
                </span>
              </div>
            </div>

            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search by mentor name, designation, department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="admin-table-responsive">
            {filteredStaff.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th style={{ width: '65px' }} className="text-center">Avatar</th>
                    <th>Mentor & Title</th>
                    <th>Department / Specialization</th>
                    <th>Contact Phone</th>
                    <th>Email Address</th>
                    <th>Blood</th>
                    <th className="text-end" style={{ minWidth: '180px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff, idx) => (
                    <tr key={staff.id || idx}>
                      <td className="admin-id-col">#{idx + 1}</td>
                      <td className="text-center">
                        {staff.file ? (
                          <img
                            src={`data:image/jpeg;base64,${staff.file}`}
                            alt={staff.displayName}
                            className="rounded-circle border"
                            style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold"
                            style={{
                              width: '42px',
                              height: '42px',
                              backgroundColor: '#eef2ff',
                              color: '#4f46e5',
                              border: '1px solid #c7d2fe',
                              fontSize: '0.85rem',
                            }}
                          >
                            {(staff.displayName || 'M')[0]}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="admin-item-title">{staff.displayName}</span>
                        <span className="admin-item-sub">{staff.displayDesignation}</span>
                      </td>
                      <td>
                        <span className="small text-muted">{staff.displayDept}</span>
                      </td>
                      <td>
                        <span className="small fw-semibold text-dark">
                          <i className="bi bi-telephone text-muted me-1"></i>
                          {staff.displayPhone}
                        </span>
                      </td>
                      <td>
                        <span className="small text-muted">{staff.email || 'mentor@bharathithervukalam.com'}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {staff.bloodgroup || 'O+'}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="admin-action-btn-group">
                          <button
                            type="button"
                            className="admin-btn-action edit"
                            onClick={() => handleOpenEdit(staff)}
                            title="Edit Staff Member"
                          >
                            <i className="bi bi-pencil-square"></i> Edit
                          </button>
                          <button
                            type="button"
                            className="admin-btn-action delete"
                            onClick={() => handleDelete(staff.id, staff.displayName)}
                            title="Delete Staff"
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
                <h5 className="admin-empty-title">No Faculty Found</h5>
                <p className="admin-empty-desc">
                  {searchTerm
                    ? `No staff members matching "${searchTerm}".`
                    : 'No faculty mentors registered yet.'}
                </p>
                <Link to="/Staff" className="btn-primary-custom py-2 px-4">
                  <i className="bi bi-person-plus me-1"></i> Register Faculty
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Staff Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="fw-bold" style={{ fontSize: '1.15rem' }}>
            <i className="bi bi-pencil-square text-primary me-2"></i>
            Edit Faculty Details
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSaveEdit}>
          <Modal.Body className="p-4">
            <div className="admin-form-group">
              <label className="admin-form-label">Full Name</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Designation / Role</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Department / Wing</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>
            <div className="row g-2">
              <div className="col-8">
                <div className="admin-form-group">
                  <label className="admin-form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="admin-form-control"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="admin-form-group">
                  <label className="admin-form-label">Blood Group</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    value={formData.bloodgroup}
                    onChange={(e) => setFormData({ ...formData, bloodgroup: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="admin-form-group mb-0">
              <label className="admin-form-label">Email Address</label>
              <input
                type="email"
                className="admin-form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="border-top">
            <Button variant="light" onClick={() => setShowEditModal(false)} className="border">
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

export default StaffView;
