import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { testApi, DEFAULT_TESTS } from '../../Api/Api';
import { triggerBlobDownload } from '../../Course/CourseDataManager';
import '../../Admin/AdminDashboard.css';

const TestView = () => {
  const [tests, setTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [formData, setFormData] = useState({
    namepost: '',
    department: '',
    paper: '',
    standard: '',
  });

  // Load from API + localStorage
  useEffect(() => {
    const loadTests = async () => {
      let merged = [];
      try {
        const custom = JSON.parse(localStorage.getItem('bharathi_custom_tests') || '[]');
        merged = [...custom];
      } catch (e) {}

      try {
        const res = await testApi.getAll();
        if (Array.isArray(res.data) && res.data.length > 0) {
          merged = [...merged, ...res.data];
        } else {
          merged = [...merged, ...DEFAULT_TESTS];
        }
      } catch (err) {
        merged = [...merged, ...DEFAULT_TESTS];
      }

      // Deduplicate by ID
      const seen = new Set();
      const unique = merged.filter((item) => {
        if (!item || seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });

      setTests(unique);
    };

    loadTests();
  }, []);

  // Filter
  const filteredTests = tests.filter((t) => {
    const q = searchTerm.toLowerCase();
    const namepost = (t.namepost || '').toLowerCase();
    const department = (t.department || '').toLowerCase();
    const paper = (t.paper || t.title || t.subject || '').toLowerCase();
    const standard = (t.standard || '').toLowerCase();
    return namepost.includes(q) || department.includes(q) || paper.includes(q) || standard.includes(q);
  });

  const handleOpenEdit = (test) => {
    setCurrentTest(test);
    setFormData({
      namepost: test.namepost || 'TNPSC',
      department: test.department || 'GROUP IV',
      paper: test.paper || test.title || test.subject || '',
      standard: test.standard || 'Question',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!currentTest) return;

    const updated = tests.map((t) =>
      t.id === currentTest.id ? { ...t, ...formData } : t
    );
    setTests(updated);
    setShowEditModal(false);

    try {
      localStorage.setItem('bharathi_custom_tests', JSON.stringify(updated));
    } catch (err) {}

    Swal.fire({
      icon: 'success',
      title: 'Updated',
      text: 'Test series details have been updated.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleDelete = async (id, title) => {
    const res = await Swal.fire({
      title: 'Delete Test Record?',
      text: `Are you sure you want to remove "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    });

    if (res.isConfirmed) {
      const updated = tests.filter((t) => t.id !== id);
      setTests(updated);
      try {
        localStorage.setItem('bharathi_custom_tests', JSON.stringify(updated));
      } catch (e) {}

      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Test record has been removed.',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleDownload = (t) => {
    const filename = t.filename || `${(t.paper || t.title || 'Test').replace(/\s+/g, '_')}.pdf`;
    triggerBlobDownload(filename, t.paper || t.title);
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        {/* Breadcrumb Navigation */}
        <nav className="admin-breadcrumb" aria-label="breadcrumb">
          <Link to="/Adm">Admin</Link>
          <span className="separator">/</span>
          <span>Examination Wing</span>
          <span className="separator">/</span>
          <span className="current">Test Series - View</span>
        </nav>

        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <span className="admin-meta-badge" style={{ color: '#2563eb' }}>
              <i className="bi bi-calendar-check-fill"></i> Test Series & Mock Exam Schedules
            </span>
            <h1>Test Series Batches & OMR Keys</h1>
            <p>Monitor weekly Saturday / Sunday question papers, model test solutions, and official OMR sheets.</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/OMR-Master" className="btn btn-outline-dark py-2 px-3 fw-semibold">
              <i className="bi bi-ui-checks-grid me-1"></i> OMR Keys & Evaluator
            </Link>
            <Link to="/Test-Add" className="btn-primary-custom py-2 px-3">
              <i className="bi bi-plus-lg me-1"></i> Schedule New Test
            </Link>
          </div>
        </div>

        {/* Main Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="d-flex align-items-center gap-2">
              <span className="admin-stat-icon blue" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>
                <i className="bi bi-calendar3"></i>
              </span>
              <div>
                <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.98rem' }}>
                  Scheduled Test Series Batches
                </h5>
                <span className="admin-counter-text">
                  Showing <b>{filteredTests.length}</b> of <b>{tests.length}</b> test series
                </span>
              </div>
            </div>

            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search by exam, department, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="admin-table-responsive">
            {filteredTests.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>S.No</th>
                    <th>Category</th>
                    <th>Department</th>
                    <th>Test Title / Subject</th>
                    <th>Document Type</th>
                    <th>Date / Duration</th>
                    <th className="text-end" style={{ minWidth: '220px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.map((test, idx) => (
                    <tr key={test.id || idx}>
                      <td className="admin-id-col">#{idx + 1}</td>
                      <td>
                        <span className="fw-bold text-dark">{test.namepost || 'TNPSC'}</span>
                      </td>
                      <td>
                        <span className="admin-id-col" style={{ color: '#0d9488' }}>
                          {test.department || 'GENERAL'}
                        </span>
                      </td>
                      <td>
                        <span className="admin-item-title">
                          {test.paper || test.title || test.subject}
                        </span>
                        {test.totalQuestions && (
                          <span className="admin-item-sub">{test.totalQuestions}</span>
                        )}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            background:
                              test.standard === 'Answer'
                                ? '#ecfdf5'
                                : test.standard === 'Schedule'
                                ? '#fffbeb'
                                : '#eff6ff',
                            color:
                              test.standard === 'Answer'
                                ? '#059669'
                                : test.standard === 'Schedule'
                                ? '#d97706'
                                : '#2563eb',
                          }}
                        >
                          {test.standard || 'Question Paper'}
                        </span>
                      </td>
                      <td>
                        <span className="small text-muted">{test.date || 'Regular Batch'}</span>
                        {test.duration && (
                          <span className="d-block small text-muted">{test.duration}</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="admin-action-btn-group">
                          <button
                            type="button"
                            className="admin-btn-action download"
                            onClick={() => handleDownload(test)}
                            title="Download PDF"
                          >
                            <i className="bi bi-download"></i> PDF
                          </button>
                          <button
                            type="button"
                            className="admin-btn-action edit"
                            onClick={() => handleOpenEdit(test)}
                            title="Edit Test Details"
                          >
                            <i className="bi bi-pencil-square"></i> Edit
                          </button>
                          <button
                            type="button"
                            className="admin-btn-action delete"
                            onClick={() =>
                              handleDelete(test.id, test.paper || test.title || test.subject)
                            }
                            title="Delete Test"
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
                  <i className="bi bi-calendar-x"></i>
                </div>
                <h5 className="admin-empty-title">No Test Series Found</h5>
                <p className="admin-empty-desc">
                  {searchTerm
                    ? `No test series matching "${searchTerm}".`
                    : 'No test batches scheduled yet. Click below to schedule the first mock exam.'}
                </p>
                <Link to="/Test-Add" className="btn-primary-custom py-2 px-4">
                  <i className="bi bi-plus-lg me-1"></i> Schedule First Test
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Test Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="fw-bold" style={{ fontSize: '1.15rem' }}>
            <i className="bi bi-pencil-square text-primary me-2"></i>
            Edit Test Series Record
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSaveEdit}>
          <Modal.Body className="p-4">
            <div className="admin-form-group">
              <label className="admin-form-label">Category</label>
              <select
                className="admin-form-select"
                value={formData.namepost}
                onChange={(e) => setFormData({ ...formData, namepost: e.target.value })}
              >
                <option value="TNPSC">TNPSC</option>
                <option value="TNUSRB">TNUSRB</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Department / Exam Stream</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Subject & Test Title</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.paper}
                onChange={(e) => setFormData({ ...formData, paper: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group mb-0">
              <label className="admin-form-label">Document Standard / Paper Type</label>
              <select
                className="admin-form-select"
                value={formData.standard}
                onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
              >
                <option value="Question">Question Paper</option>
                <option value="Answer">Answer Key</option>
                <option value="Schedule">Schedule / Time Table</option>
                <option value="OMR Sheet">OMR Practice Sheet</option>
              </select>
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

export default TestView;
