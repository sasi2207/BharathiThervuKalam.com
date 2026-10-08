import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import './Group.css';

export default function Group4() {
  const [activeTab, setActiveTab] = useState('overview');

  const handleScheduleDownload = () => {
    const link = document.createElement('a');
    link.href = '/SUNDAY%20GRP%204%20SCHEDULE%20-2026.pdf';
    link.download = 'SUNDAY GRP 4 SCHEDULE -2026.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: 'success',
      title: 'Schedule Downloaded',
      text: 'Sunday Group 4 Test Series 2026 Schedule has been downloaded.',
      timer: 2500,
      showConfirmButton: false
    });
  };

  const postings = [
    'Village Administrative Officer (VAO)',
    'Junior Assistant (Non-Security & Security)',
    'Bill Collector (Grade-I)',
    'Typist (Tamil & English)',
    'Steno-Typist (Grade-III)',
    'Field Surveyor (Survey & Settlement Dept)',
    'Draftsman',
    'Forest Guard & Forest Watcher'
  ];

  return (
    <div className="course-detail-page">
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
              <Link to="/#courses" className="text-warning text-decoration-none">Courses</Link>
              <span>/</span>
              <span className="text-light">TNPSC Group 4 & VAO</span>
            </div>

            <h1 className="text-white mb-2 fw-bold">TNPSC Group IV & VAO Services</h1>
            <p className="text-light opacity-75 mb-4" style={{ maxWidth: '750px' }}>
              The largest civil recruitment examination in Tamil Nadu offering vital grassroots administrative and village administration postings with 10th standard eligibility.
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/Student-Register" className="btn-gold-custom">
                  <i className="bi bi-pencil-square"></i>
                  <span>Join Group 4 Batch</span>
                </Link>
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.04 }} 
                whileTap={{ scale: 0.96 }}
                onClick={handleScheduleDownload} 
                className="btn-outline-custom text-white border-light"
              >
                <i className="bi bi-file-earmark-pdf"></i>
                <span>Sunday Test Schedule (PDF)</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="site-container py-5">
        <div className="course-nav-tabs">
          <button 
            className={`course-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview & Posts
          </button>
          <button 
            className={`course-tab-btn ${activeTab === 'scheme' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheme')}
          >
            Exam Scheme (300 Marks)
          </button>
          <button 
            className={`course-tab-btn ${activeTab === 'eligibility' ? 'active' : ''}`}
            onClick={() => setActiveTab('eligibility')}
          >
            Eligibility & Age Limit
          </button>
          <button 
            className={`course-tab-btn ${activeTab === 'sunday' ? 'active' : ''}`}
            onClick={() => setActiveTab('sunday')}
          >
            Sunday Test Batch 2026
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="row g-4">
                <div className="col-12 col-lg-8">
                  <div className="academic-card mb-4">
                    <h4 className="mb-3">About TNPSC Group 4 & VAO Examination</h4>
                    <p>
                      The Combined Civil Services Examination - IV (Group IV & VAO) recruits candidates directly for executive village administration and clerical positions across all Tamil Nadu Government departments. With a minimum qualification of 10th standard (SSLC), this exam provides thousands of candidates with an entry ticket to permanent Government service.
                    </p>
                  </div>

                  <div className="academic-card">
                    <h4 className="mb-3">Designated Postings</h4>
                    <div className="row g-2">
                      {postings.map((post, idx) => (
                        <div className="col-12 col-md-6" key={idx}>
                          <motion.div whileHover={{ x: 3 }} className="posting-chip">
                            <i className="bi bi-check2-circle text-warning"></i>
                            <span>{post}</span>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-4">
                  <div className="academic-card bg-light">
                    <div className="card-kicker">Key Facts</div>
                    <h5 className="mb-3">Group 4 at a Glance</h5>
                    <div className="d-flex justify-content-between py-2 border-bottom small">
                      <span className="text-muted">Minimum Qualification:</span>
                      <strong>10th (SSLC Pass)</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom small">
                      <span className="text-muted">Minimum Age:</span>
                      <strong>21 (VAO) / 18 (Clerical)</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom small">
                      <span className="text-muted">Selection Mode:</span>
                      <strong>Single OMR Written Exam</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 small">
                      <span className="text-muted">Test Day:</span>
                      <strong>Every Sunday (10 AM)</strong>
                    </div>

                    <div className="mt-4">
                      <button onClick={handleScheduleDownload} className="btn-gold-custom w-100 text-center">
                        Download Sunday Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scheme' && (
              <div className="academic-card">
                <h4 className="mb-3">Detailed Examination Pattern (Single Paper)</h4>
                <p className="text-muted small">
                  The exam is conducted for 3 hours duration with 200 objective questions for 300 marks.
                </p>

                <div className="table-responsive">
                  <table className="academic-table">
                    <thead>
                      <tr>
                        <th>Section</th>
                        <th>Subjects</th>
                        <th>No. of Questions</th>
                        <th>Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Part A</strong></td>
                        <td>General Tamil (Eligibility & Scoring - SSLC Standard)</td>
                        <td>100 Questions</td>
                        <td>150 Marks</td>
                      </tr>
                      <tr>
                        <td><strong>Part B</strong></td>
                        <td>General Studies (SSLC Standard)</td>
                        <td>75 Questions</td>
                        <td>112.5 Marks</td>
                      </tr>
                      <tr>
                        <td><strong>Part C</strong></td>
                        <td>Aptitude & Mental Ability Tests (SSLC Standard)</td>
                        <td>25 Questions</td>
                        <td>37.5 Marks</td>
                      </tr>
                      <tr className="bg-light">
                        <td colSpan="2"><strong>Total</strong></td>
                        <td><strong>200 Questions</strong></td>
                        <td><strong>300 Marks (3 Hours)</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-3 bg-light rounded-3 small text-muted">
                  <strong>Scoring Note:</strong> Part A (Tamil Eligibility) requires a minimum qualifying score of 40% (60 marks) for Part B & C to be evaluated. Merit ranking is calculated based on the total 300 marks.
                </div>
              </div>
            )}

            {activeTab === 'eligibility' && (
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="academic-card h-100">
                    <h4 className="mb-3">Educational Qualifications</h4>
                    <ul className="text-muted small ps-3">
                      <li className="mb-2"><strong>VAO & Junior Assistant:</strong> Must have passed S.S.L.C. (10th) with eligibility for admission to Higher Secondary Courses.</li>
                      <li className="mb-2"><strong>Typist:</strong> Must have passed 10th and Government Technical Examination in Typewriting (Higher in Tamil & English or Higher in one and Lower in other).</li>
                      <li className="mb-2"><strong>Steno-Typist:</strong> Must have passed 10th and Typewriting + Shorthand qualifications.</li>
                    </ul>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="academic-card h-100">
                    <h4 className="mb-3">Age Limits (For VAO Posts)</h4>
                    <div className="table-responsive">
                      <table className="academic-table">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Min Age</th>
                            <th>Max Age</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>SC / SC(A) / ST</strong></td>
                            <td>21 Years</td>
                            <td><strong>42 Years</strong></td>
                          </tr>
                          <tr>
                            <td><strong>MBC / DC / BC / BCM</strong></td>
                            <td>21 Years</td>
                            <td><strong>42 Years</strong></td>
                          </tr>
                          <tr>
                            <td><strong>Others (General)</strong></td>
                            <td>21 Years</td>
                            <td><strong>32 Years</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sunday' && (
              <div className="academic-card">
                <h4 className="mb-3">Bharathi Academy Sunday Special Group 4 Test Batch</h4>
                <p className="text-muted">
                  Specifically formulated for working professionals and rural candidates who can attend intensive coaching on Sundays in Erode:
                </p>

                <div className="row g-3 my-3">
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <h6 className="fw-bold mb-1">General Tamil Dominance</h6>
                      <p className="small text-muted mb-0">Daily 100-mark Tamil drills from 6th to 12th standard Samacheer Kalvi textbooks.</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <h6 className="fw-bold mb-1">Statewide OMR Ranking</h6>
                      <p className="small text-muted mb-0">Instant results publication with statewide percentile and comparative weak-spot analysis.</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <h6 className="fw-bold mb-1">100% Free Foundation</h6>
                      <p className="small text-muted mb-0">Lectures and mentorship provided at zero tuition cost by our passionate team of officers.</p>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleScheduleDownload} 
                    className="btn-gold-custom"
                  >
                    <i className="bi bi-download"></i>
                    <span>Download Sunday Schedule (PDF)</span>
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link to="/Student-Register" className="btn-primary-custom">
                      Register for Sunday Batch
                    </Link>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
