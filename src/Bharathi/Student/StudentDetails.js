import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { studentApi } from '../Api/Api';
import { triggerBlobDownload } from '../Course/CourseDataManager';
import '../Admin/AdminDashboard.css';

const DEFAULT_STUDENTS = [
  {
    id: 1,
    username: 'S. Vigneshwaran',
    registerNo: 'TN2026-0184',
    fatherName: 'K. Subramanian',
    dob: '1998-05-14',
    qualification: 'B.E. (Mechanical)',
    phoneNumber: '9842104592',
    whatsappNumber: '9842104592',
    fatherPhoneNumber: '9443218901',
    email: 'vignesh.subramanian@gmail.com',
    aadhaarNumber: '7821-4509-3211',
    caste: 'BC',
    bloodGroup: 'O+',
    exServiceman: 'no',
    destitute: 'no',
    pstmtenth: true,
    pstmtowelth: true,
    pstmug: true,
    pstmpg: false,
    address: '42, Gandhiji Road, Solar, Erode - 638002',
    paymentId: 'pay_OMR2026_001',
    tamilTyping: 'TamilHigher',
    englishTyping: 'EnglishHigher',
  },
  {
    id: 2,
    username: 'K. Meenakshi',
    registerNo: 'TN2026-0185',
    fatherName: 'M. Karuppasamy',
    dob: '1999-11-22',
    qualification: 'M.A. (Tamil Literature)',
    phoneNumber: '9789456123',
    whatsappNumber: '9789456123',
    fatherPhoneNumber: '9842112233',
    email: 'meenakshi.karuppasamy@gmail.com',
    aadhaarNumber: '6543-9871-2345',
    caste: 'MBC',
    bloodGroup: 'B+',
    exServiceman: 'no',
    destitute: 'no',
    pstmtenth: true,
    pstmtowelth: true,
    pstmug: true,
    pstmpg: true,
    address: '15/B, Anna Nagar, Perundurai, Erode - 638052',
    paymentId: 'pay_OMR2026_002',
    tamilTyping: 'TamilLower',
    englishTyping: 'EnglishLower',
  },
  {
    id: 3,
    username: 'P. Arunkumar',
    registerNo: 'TN2026-0186',
    fatherName: 'S. Palanisamy',
    dob: '1997-03-08',
    qualification: 'B.Sc. (Physics)',
    phoneNumber: '9488776655',
    whatsappNumber: '9488776655',
    fatherPhoneNumber: '9443322110',
    email: 'arunkumar.police@gmail.com',
    aadhaarNumber: '8901-2345-6789',
    caste: 'SC',
    bloodGroup: 'A+',
    exServiceman: 'no',
    destitute: 'no',
    pstmtenth: true,
    pstmtowelth: true,
    pstmug: false,
    pstmpg: false,
    address: '8, West Street, Bhavani, Erode - 638301',
    paymentId: 'pay_OMR2026_003',
    tamilTyping: '',
    englishTyping: '',
  },
  {
    id: 4,
    username: 'R. Sangeetha',
    registerNo: 'TN2026-0187',
    fatherName: 'V. Ramasamy',
    dob: '2000-08-19',
    qualification: 'B.Com. (CA)',
    phoneNumber: '9629112244',
    whatsappNumber: '9629112244',
    fatherPhoneNumber: '9843009988',
    email: 'sangeetha.ramasamy@gmail.com',
    aadhaarNumber: '4532-7890-1234',
    caste: 'BCM',
    bloodGroup: 'AB+',
    exServiceman: 'no',
    destitute: 'no',
    pstmtenth: true,
    pstmtowelth: true,
    pstmug: true,
    pstmpg: false,
    address: '22, Mosque Street, Brough Road, Erode - 638001',
    paymentId: 'pay_OMR2026_004',
    tamilTyping: 'TamilHigher',
    englishTyping: 'EnglishLower',
  }
];

export default function UserDetails() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [communityFilter, setCommunityFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      let custom = [];
      try {
        custom = JSON.parse(localStorage.getItem('bharathi_custom_students') || '[]');
      } catch (e) {}

      let apiData = [];
      try {
        const response = await studentApi.getAll();
        if (Array.isArray(response.data) && response.data.length > 0) {
          apiData = response.data;
        } else {
          apiData = DEFAULT_STUDENTS;
        }
      } catch (error) {
        apiData = DEFAULT_STUDENTS;
      }

      const combined = [...custom, ...apiData];
      const seen = new Set();
      const unique = combined.filter((s) => {
        const idKey = s.id || s.registerNo || s.email;
        if (!idKey || seen.has(idKey)) return false;
        seen.add(idKey);
        return true;
      });

      setUsers(unique);
    };

    fetchUsers();
  }, []);

  // Filter
  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.registerNo && u.registerNo.toLowerCase().includes(q)) ||
      (u.phoneNumber && u.phoneNumber.includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (communityFilter === 'all') return true;
    if (communityFilter === 'pstm') return u.pstmtenth || u.pstmtowelth || u.pstmug;
    if (communityFilter === 'ex') return u.exServiceman === 'yes';
    return (u.caste && u.caste.toUpperCase() === communityFilter.toUpperCase());
  });

  const handleOpenDetail = (student) => {
    setSelectedUser(student);
    setShowDetailModal(true);
  };

  const handleDownloadPDF = (student) => {
    triggerBlobDownload(
      `Application_${student.registerNo || student.username}.pdf`,
      `Student Admission Record - ${student.username}`
    );
  };

  const handleDelete = async (id, name) => {
    const res = await Swal.fire({
      title: 'Remove Candidate Record?',
      text: `Are you sure you want to remove ${name} from active student list?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
    });

    if (res.isConfirmed) {
      const updated = users.filter((u) => u.id !== id);
      setUsers(updated);
      try {
        localStorage.setItem('bharathi_custom_students', JSON.stringify(updated));
      } catch (e) {}

      Swal.fire({
        icon: 'success',
        title: 'Removed',
        text: 'Candidate record removed.',
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
          <span>Candidate Admissions</span>
          <span className="separator">/</span>
          <span className="current">Student - View</span>
        </nav>

        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <span className="admin-meta-badge" style={{ color: '#059669' }}>
              <i className="bi bi-people-fill"></i> Candidate Roster & Admissions
            </span>
            <h1>Enrolled Students Management</h1>
            <p>Complete directory of registered competitive exam candidates for 2026 Batch across Tamil Nadu.</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/Student" className="btn-primary-custom py-2 px-3">
              <i className="bi bi-person-plus me-1"></i> Add New Candidate
            </Link>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="admin-stat-card py-3">
              <div>
                <div className="admin-stat-val" style={{ fontSize: '1.4rem' }}>{users.length}</div>
                <div className="admin-stat-lbl">Total Candidates</div>
              </div>
              <div className="admin-stat-icon blue" style={{ width: '38px', height: '38px' }}>
                <i className="bi bi-people"></i>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="admin-stat-card py-3">
              <div>
                <div className="admin-stat-val" style={{ fontSize: '1.4rem' }}>
                  {users.filter(u => u.pstmtenth || u.pstmug).length}
                </div>
                <div className="admin-stat-lbl">PSTM Tamil Medium</div>
              </div>
              <div className="admin-stat-icon green" style={{ width: '38px', height: '38px' }}>
                <i className="bi bi-patch-check"></i>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="admin-stat-card py-3">
              <div>
                <div className="admin-stat-val" style={{ fontSize: '1.4rem' }}>
                  {users.filter(u => u.caste === 'BC' || u.caste === 'MBC').length}
                </div>
                <div className="admin-stat-lbl">BC / MBC Applicants</div>
              </div>
              <div className="admin-stat-icon amber" style={{ width: '38px', height: '38px' }}>
                <i className="bi bi-bookmark-star"></i>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="admin-stat-card py-3">
              <div>
                <div className="admin-stat-val" style={{ fontSize: '1.4rem' }}>
                  {users.filter(u => u.tamilTyping || u.englishTyping).length}
                </div>
                <div className="admin-stat-lbl">Typing / Steno Skills</div>
              </div>
              <div className="admin-stat-icon purple" style={{ width: '38px', height: '38px' }}>
                <i className="bi bi-keyboard"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            {/* Category / Community Filter */}
            <div className="d-flex align-items-center gap-1 flex-wrap">
              {[
                { id: 'all', label: 'All Candidates' },
                { id: 'BC', label: 'BC' },
                { id: 'MBC', label: 'MBC / DNC' },
                { id: 'SC', label: 'SC / SCA' },
                { id: 'pstm', label: 'PSTM Quota (20%)' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCommunityFilter(f.id)}
                  className={`btn btn-sm ${
                    communityFilter === f.id
                      ? 'btn-dark fw-bold'
                      : 'btn-outline-secondary'
                  }`}
                  style={{ borderRadius: '6px', fontSize: '0.78125rem' }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search by name, reg no, mobile, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="admin-table-responsive">
            {filteredUsers.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th>Candidate Profile</th>
                    <th>Register No</th>
                    <th>Contact Information</th>
                    <th>Qualification</th>
                    <th>Community</th>
                    <th>PSTM Status</th>
                    <th className="text-end" style={{ minWidth: '220px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((student, idx) => (
                    <tr key={student.id || idx}>
                      <td className="admin-id-col">#{idx + 1}</td>
                      <td>
                        <span className="admin-item-title">{student.username}</span>
                        <span className="admin-item-sub">
                          DOB: {student.dob || 'N/A'} · Blood: {student.bloodGroup || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className="admin-id-col text-primary fw-bold">
                          {student.registerNo || `TN2026-${String(idx + 1).padStart(4, '0')}`}
                        </span>
                      </td>
                      <td>
                        <div className="small fw-semibold text-dark">
                          <i className="bi bi-telephone-fill text-muted me-1"></i>
                          {student.phoneNumber}
                        </div>
                        <div className="small text-muted">{student.email}</div>
                      </td>
                      <td>
                        <span className="small fw-semibold text-secondary">
                          {student.qualification || 'Degree Standard'}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            background: '#f1f5f9',
                            color: '#334155',
                          }}
                        >
                          {(student.caste || 'GEN').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {student.pstmtenth || student.pstmug ? (
                          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                            PSTM Yes
                          </span>
                        ) : (
                          <span className="text-muted small">No</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="admin-action-btn-group">
                          <button
                            type="button"
                            className="admin-btn-action edit"
                            onClick={() => handleOpenDetail(student)}
                            title="View Full Profile"
                          >
                            <i className="bi bi-eye"></i> Details
                          </button>
                          <button
                            type="button"
                            className="admin-btn-action download"
                            onClick={() => handleDownloadPDF(student)}
                            title="Download Application Form"
                          >
                            <i className="bi bi-file-earmark-pdf"></i> PDF
                          </button>
                          <button
                            type="button"
                            className="admin-btn-action delete"
                            onClick={() => handleDelete(student.id, student.username)}
                            title="Remove Student"
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
                  <i className="bi bi-people"></i>
                </div>
                <h5 className="admin-empty-title">No Students Found</h5>
                <p className="admin-empty-desc">
                  {searchTerm
                    ? `No students matching "${searchTerm}". Try another name or phone number.`
                    : 'No candidates registered in this category.'}
                </p>
                <Link to="/Student" className="btn-primary-custom py-2 px-4">
                  <i className="bi bi-person-plus me-1"></i> Register Student
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Candidate Profile Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="fw-bold" style={{ fontSize: '1.15rem' }}>
            <i className="bi bi-person-badge text-primary me-2"></i>
            Candidate Full Dossier
          </Modal.Title>
        </Modal.Header>
        {selectedUser && (
          <Modal.Body className="p-4">
            <div className="row g-3">
              {/* Header Box */}
              <div className="col-12">
                <div className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold mb-1 text-dark">{selectedUser.username}</h5>
                    <span className="small text-muted">Register No: <b>{selectedUser.registerNo}</b></span>
                  </div>
                  <span className="badge bg-primary px-3 py-2">
                    Batch 2026 Confirmed
                  </span>
                </div>
              </div>

              {/* Personal */}
              <div className="col-12 col-md-6">
                <div className="border rounded-3 p-3 h-100">
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">
                    <i className="bi bi-person text-primary me-2"></i>Personal Info
                  </h6>
                  <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
                    <li><span className="text-muted">Father / Guardian:</span> <b>{selectedUser.fatherName || 'N/A'}</b></li>
                    <li><span className="text-muted">Date of Birth:</span> <b>{selectedUser.dob || 'N/A'}</b></li>
                    <li><span className="text-muted">Community:</span> <b className="text-uppercase">{selectedUser.caste || 'N/A'}</b></li>
                    <li><span className="text-muted">Blood Group:</span> <b>{selectedUser.bloodGroup || 'N/A'}</b></li>
                    <li><span className="text-muted">Aadhaar:</span> <b>{selectedUser.aadhaarNumber || 'Verified'}</b></li>
                  </ul>
                </div>
              </div>

              {/* Contact */}
              <div className="col-12 col-md-6">
                <div className="border rounded-3 p-3 h-100">
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">
                    <i className="bi bi-telephone text-primary me-2"></i>Contact Details
                  </h6>
                  <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
                    <li><span className="text-muted">Mobile:</span> <b>+91 {selectedUser.phoneNumber}</b></li>
                    <li><span className="text-muted">WhatsApp:</span> <b>+91 {selectedUser.whatsappNumber || selectedUser.phoneNumber}</b></li>
                    <li><span className="text-muted">Parent Contact:</span> <b>+91 {selectedUser.fatherPhoneNumber || 'N/A'}</b></li>
                    <li><span className="text-muted">Email:</span> <b>{selectedUser.email}</b></li>
                    <li><span className="text-muted">Address:</span> <b>{selectedUser.address || 'Erode, Tamil Nadu'}</b></li>
                  </ul>
                </div>
              </div>

              {/* Education & Reservations */}
              <div className="col-12">
                <div className="border rounded-3 p-3">
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">
                    <i className="bi bi-mortarboard text-primary me-2"></i>Academic & Quotas
                  </h6>
                  <div className="row g-2 small">
                    <div className="col-12 col-md-4">
                      <span className="text-muted">Highest Qualification:</span>
                      <div className="fw-bold">{selectedUser.qualification || 'Degree Standard'}</div>
                    </div>
                    <div className="col-12 col-md-4">
                      <span className="text-muted">Tamil Medium (PSTM 20%):</span>
                      <div className="fw-bold text-success">
                        {selectedUser.pstmtenth ? '10th ' : ''}
                        {selectedUser.pstmtowelth ? '12th ' : ''}
                        {selectedUser.pstmug ? 'UG ' : ''}
                        {selectedUser.pstmpg ? 'PG' : ''}
                        {!selectedUser.pstmtenth && !selectedUser.pstmug && 'None'}
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <span className="text-muted">Ex-Serviceman / Destitute:</span>
                      <div className="fw-bold">{selectedUser.exServiceman === 'yes' ? 'Ex-Serviceman' : 'Standard'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        )}
        <Modal.Footer className="border-top">
          <Button variant="light" onClick={() => setShowDetailModal(false)} className="border">
            Close
          </Button>
          {selectedUser && (
            <Button
              variant="primary"
              onClick={() => handleDownloadPDF(selectedUser)}
              className="btn-primary-custom"
            >
              <i className="bi bi-download me-1"></i> Download PDF Application
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
