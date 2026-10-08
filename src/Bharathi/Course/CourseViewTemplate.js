import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import {
  getCourseList,
  updateCourseItem,
  deleteCourseItem,
  triggerBlobDownload,
} from './CourseDataManager';
import '../Admin/AdminDashboard.css';

export default function CourseViewTemplate({
  courseKey,
  examType = 'TNPSC', // 'TNPSC' or 'TNUSRB'
  title = 'Course Syllabus & Notes',
  subtitle = 'Published curriculum, syllabus papers, and downloadable guides for candidates.',
  addRoute = '/Group-I-Add',
}) {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({ syllabus: '', paper: '', subject: '' });

  // Load from data manager
  useEffect(() => {
    const data = getCourseList(courseKey);
    setItems(data);
  }, [courseKey]);

  // Filter items
  const filteredItems = items.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      (item.syllabus && item.syllabus.toLowerCase().includes(q)) ||
      (item.paper && item.paper.toLowerCase().includes(q)) ||
      (item.subject && item.subject.toLowerCase().includes(q))
    );
  });

  // Handle Edit
  const handleOpenEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      syllabus: item.syllabus || '',
      paper: item.paper || '',
      subject: item.subject || '',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!currentItem) return;

    const updatedList = updateCourseItem(courseKey, currentItem.id, formData);
    setItems(updatedList);
    setShowEditModal(false);

    Swal.fire({
      icon: 'success',
      title: 'Updated',
      text: 'Syllabus details have been successfully updated.',
      timer: 1600,
      showConfirmButton: false,
    });
  };

  // Handle Delete
  const handleDelete = async (id, syllabusName) => {
    const res = await Swal.fire({
      title: 'Delete Syllabus?',
      text: `Are you sure you want to remove "${syllabusName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
    });

    if (res.isConfirmed) {
      const updatedList = deleteCourseItem(courseKey, id);
      setItems(updatedList);
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'The syllabus has been removed from catalog.',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Handle Download
  const handleDownload = (item) => {
    const filename = item.filename || `${item.syllabus.replace(/\s+/g, '_')}.pdf`;
    triggerBlobDownload(filename, item.syllabus);
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        {/* Breadcrumb Navigation */}
        <nav className="admin-breadcrumb" aria-label="breadcrumb">
          <Link to="/Adm">Admin</Link>
          <span className="separator">/</span>
          <span>{examType}</span>
          <span className="separator">/</span>
          <span>Courses View</span>
          <span className="separator">/</span>
          <span className="current">{title}</span>
        </nav>

        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <span className={`admin-meta-badge ${examType.toLowerCase()}`}>
              <i className="bi bi-shield-check"></i> {examType} Department
            </span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="admin-header-actions">
            <Link to={addRoute} className="btn-primary-custom py-2 px-3">
              <i className="bi bi-plus-lg me-1"></i> Add New Syllabus
            </Link>
          </div>
        </div>

        {/* Main Card */}
        <div className="admin-card">
          {/* Card Header & Search Toolbar */}
          <div className="admin-card-header">
            <div className="d-flex align-items-center gap-2">
              <span className="admin-stat-icon blue" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>
                <i className="bi bi-journal-text"></i>
              </span>
              <div>
                <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.98rem' }}>
                  Curriculum Directory
                </h5>
                <span className="admin-counter-text">
                  Showing <b>{filteredItems.length}</b> of <b>{items.length}</b> items
                </span>
              </div>
            </div>

            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search by title, paper, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table View */}
          <div className="admin-table-responsive">
            {filteredItems.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>ID</th>
                    <th style={{ width: '60px' }} className="text-center">Doc</th>
                    <th>Syllabus Title</th>
                    <th style={{ minWidth: '180px' }}>Paper / Stage</th>
                    <th style={{ minWidth: '220px' }}>Subject Scope</th>
                    <th className="text-end" style={{ minWidth: '220px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="admin-id-col">#{idx + 1}</td>
                      <td className="text-center">
                        <div className="admin-doc-pill">
                          <i className="bi bi-file-earmark-pdf-fill"></i>
                        </div>
                      </td>
                      <td>
                        <span className="admin-item-title">{item.syllabus}</span>
                        {item.date && (
                          <span className="admin-item-sub">Published: {item.date}</span>
                        )}
                      </td>
                      <td>
                        <span className="fw-semibold text-secondary">{item.paper}</span>
                      </td>
                      <td>
                        <span className="text-muted small">{item.subject}</span>
                      </td>
                      <td className="text-end">
                        <div className="admin-action-btn-group">
                          <button
                            type="button"
                            className="admin-btn-action download"
                            onClick={() => handleDownload(item)}
                            title="Download PDF"
                          >
                            <i className="bi bi-download"></i> PDF
                          </button>
                          <button
                            type="button"
                            className="admin-btn-action edit"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Record"
                          >
                            <i className="bi bi-pencil-square"></i> Edit
                          </button>
                          <button
                            type="button"
                            className="admin-btn-action delete"
                            onClick={() => handleDelete(item.id, item.syllabus)}
                            title="Remove Record"
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
                  <i className="bi bi-journal-x"></i>
                </div>
                <h5 className="admin-empty-title">No Syllabus Records Found</h5>
                <p className="admin-empty-desc">
                  {searchTerm
                    ? `No courses matching "${searchTerm}". Try a different keyword.`
                    : 'No syllabus records have been added to this department yet.'}
                </p>
                <Link to={addRoute} className="btn-primary-custom py-2 px-4">
                  <i className="bi bi-plus-lg me-1"></i> Add First Syllabus
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="fw-bold" style={{ fontSize: '1.15rem' }}>
            <i className="bi bi-pencil-square text-primary me-2"></i>
            Edit Syllabus Details
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSaveEdit}>
          <Modal.Body className="p-4">
            <div className="admin-form-group">
              <label className="admin-form-label">Syllabus Title</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.syllabus}
                onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Exam Paper / Stage</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.paper}
                onChange={(e) => setFormData({ ...formData, paper: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group mb-0">
              <label className="admin-form-label">Subject & Syllabus Content</label>
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
}
