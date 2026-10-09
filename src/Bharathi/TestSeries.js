import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { testApi } from './Api/Api';
import AcademicCardCheckmark from './Common/AcademicCardCheckmark';

const TestSeries = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedSchedules, setCompletedSchedules] = useState(() => {
    try {
      const saved = localStorage.getItem('completed_schedules');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await testApi.getAll();
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        }
      } catch (error) {
        // Quiet fallback to avoid disruptive alerts
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDownloadPDF = (filename, label, scheduleKey = filename) => {
    const link = document.createElement('a');
    link.href = `/${encodeURIComponent(filename)}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Mark schedule as downloaded & completed with animated check-mark
    setCompletedSchedules((prev) => {
      const next = { ...prev, [scheduleKey]: true };
      try {
        localStorage.setItem('completed_schedules', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    Swal.fire({
      icon: 'success',
      title: 'Download Started',
      text: `${label} downloaded. Academic schedule verified with check-mark.`,
      timer: 1800,
      showConfirmButton: false
    });
  };

  return (
    <div className="test-series-page">
      {/* Hero Banner */}
      <section className="course-hero overflow-hidden">
        <div className="site-container">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="d-flex align-items-center gap-2 text-warning small fw-bold text-uppercase mb-2">
              <Link to="/" className="text-warning text-decoration-none">Home</Link>
              <span>/</span>
              <span className="text-light">Test Series 2026</span>
            </div>

            <h1 className="text-white mb-2 fw-bold">2026 Statewide Test Batch & Mock Schedules</h1>
            <p className="text-light opacity-75 mb-4" style={{ maxWidth: '750px' }}>
              Weekly offline examination batches simulating authentic TNPSC and TNUSRB exam conditions with OMR evaluation and performance benchmarking.
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/student-dashboard" className="btn btn-warning text-dark fw-bold px-3 py-2 shadow">
                  <i className="bi bi-ui-checks-grid me-1"></i>
                  <span>Practice Digital OMR Sheet</span>
                </Link>
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleDownloadPDF('Tnpsc - OMR Sheet-1.pdf', 'Official OMR Sheet')}
                className="btn-gold-custom"
              >
                <i className="bi bi-file-earmark-pdf"></i>
                <span>Download OMR PDF</span>
              </motion.button>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/Student-Register" className="btn-outline-custom text-white border-light">
                  <i className="bi bi-pencil-square"></i>
                  <span>Register for Test Batch</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="site-container py-5">
        {/* Core Schedules Section */}
        <div className="section-header text-center mx-auto mb-4" style={{ maxWidth: '680px' }}>
          <div className="section-kicker">Official Timetables</div>
          <h2 className="section-title">Verified 2026 Test Series Schedules</h2>
          <p className="section-subtitle mx-auto">
            Comprehensive timetables covering syllabus progression, subject-wise weekly breakdown, and full-length mock tests.
          </p>
        </div>

        {/* Dynamic Schedules Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading active test schedules from database...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-5 text-muted border rounded-3 bg-light my-4">
            <i className="bi bi-calendar-x fs-1 d-block mb-2"></i>
            <h5>No Test Schedules Found</h5>
            <p className="small mb-0">Tests created in the Admin console will appear dynamically here.</p>
          </div>
        ) : (
          <div className="row g-4 mb-5">
            {posts.map((test, index) => {
              const testKey = `test-${test.id || index}`;
              const filename = test.pdf_filename || test.filename || 'SATURDAY TIME TABLE-1.pdf';
              const isCompleted = !!completedSchedules[testKey];
              const isSpecial = (test.category || '').toUpperCase() === 'TNPSC' && (test.department || '').includes('IV');

              return (
                <div className="col-12 col-md-6 col-lg-4" key={test.id || index}>
                  <motion.div 
                    whileHover={{ y: -6, boxShadow: '0 15px 30px rgba(10, 25, 47, 0.1)' }}
                    className={`academic-card text-center h-100 ${isSpecial ? 'border-warning' : ''} ${isCompleted ? 'completed' : ''}`}
                  >
                    <AcademicCardCheckmark label={`${test.title || 'Schedule'} Verified`} />
                    <div className={`card-kicker ${isSpecial ? 'text-warning' : ''}`}>
                      {test.category || 'EXAM BATCH'} · {test.department || 'Competitive Stream'}
                    </div>
                    <h4 className="mb-2">{test.title}</h4>
                    <p className="small text-muted flex-grow-1">
                      {test.paper ? `${test.paper} · ` : ''}
                      {test.total_questions ? `${test.total_questions} Questions` : 'Full Length Mock'}
                      {test.duration_minutes ? ` (${test.duration_minutes} Mins)` : ''}
                      {test.exam_date ? ` · Date: ${test.exam_date}` : ''}
                    </p>
                    <div className="d-flex justify-content-center align-items-center gap-2 text-danger small mb-3">
                      <i className="bi bi-file-earmark-pdf-fill fs-5"></i>
                      <span className="fw-semibold text-truncate" style={{ maxWidth: '240px' }}>{filename}</span>
                    </div>
                    {isCompleted && (
                      <div className="mb-3 d-flex justify-content-center">
                        <span className="academic-card-status-badge">
                          <i className="bi bi-check2-circle"></i> Downloaded · Ready for Test
                        </span>
                      </div>
                    )}
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownloadPDF(filename, test.title, testKey)}
                      className={isSpecial ? 'btn-gold-custom w-100' : 'btn-primary-custom w-100'}
                    >
                      <i className="bi bi-download"></i>
                      <span>{isCompleted ? 'Re-download Schedule' : 'Download Schedule PDF'}</span>
                    </motion.button>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}

        {/* Test Guidelines & Methodology */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="academic-card p-4 p-md-5 mb-5"
        >
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-7">
              <h3 className="mb-3">Bharathi Test Batch Guidelines</h3>
              <ul className="text-muted small ps-3 mb-0">
                <li className="mb-2"><strong>Reporting Time:</strong> Candidates must report to the Erode center by <strong>9:45 AM</strong>. Test commences sharply at <strong>10:00 AM</strong>.</li>
                <li className="mb-2"><strong>Standard OMR Format:</strong> Tests are evaluated using automated high-speed scanners. Bubbling discipline is strictly monitored.</li>
                <li className="mb-2"><strong>Question Quality:</strong> Standardized questions prepared by serving officers with emphasis on previous year TNPSC trends and current affairs.</li>
                <li className="mb-2"><strong>Detailed Discussion:</strong> Post-test answer key discussion and doubt clearance session held between <strong>1:30 PM and 3:30 PM</strong>.</li>
                <li className="mb-0"><strong>Statewide Rank List:</strong> Marks and statewide percentile published on the student portal within 24 hours of test completion.</li>
              </ul>
            </div>

            <div className="col-12 col-lg-5">
              <div className="bg-light p-4 rounded-3 border">
                <h5 className="fw-bold mb-3">Test Timings & Centers</h5>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Saturday Batch:</span>
                  <strong>10:00 AM – 1:00 PM (Group 1, 2, SI)</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Sunday Batch:</span>
                  <strong>10:00 AM – 1:00 PM (Group 4 & VAO)</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Venue:</span>
                  <strong>Bharathi Academy, Erode Center</strong>
                </div>
                <div className="d-flex justify-content-between py-2 small">
                  <span className="text-muted">Fees:</span>
                  <strong>Free Mentorship (Nominal Print Cost)</strong>
                </div>
                <div className="mt-3">
                  <Link to="/Student-Register" className="btn-gold-custom w-100 text-center py-2 fs-7">
                    Enroll for Test Batch 2026
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestSeries;
