import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Group.css';

const Group2 = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const postings = [
    'Sub-Registrar (Registration Department)',
    'Deputy Commercial Tax Officer (DCTO)',
    'Assistant Section Officer (ASO) - Secretariat / TNPSC / Law',
    'Municipal Commissioner (Grade-II)',
    'Assistant Inspector of Labour',
    'Probation Officer (Prisons Department)',
    'Junior Employment Officer',
    'Special Assistant in Vigilance and Anti-Corruption',
    'Audit Inspector in HR & CE Department',
    'Senior Inspector of Co-operative Societies',
    'Assistant Inspector in Local Fund Audit'
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
              <span className="text-light">TNPSC Group 2</span>
            </div>

            <h1 className="text-white mb-2 fw-bold">TNPSC Group II Services (Interview Posts)</h1>
            <p className="text-light opacity-75 mb-4" style={{ maxWidth: '750px' }}>
              Recruitment for prestigious state executive positions including Sub-Registrars, Municipal Commissioners, and Secretariat Assistant Section Officers.
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/Student-Register" className="btn-gold-custom">
                  <i className="bi bi-pencil-square"></i>
                  <span>Join Group 2 Batch</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/Test-Series" className="btn-outline-custom text-white border-light">
                  <i className="bi bi-calendar-check"></i>
                  <span>Test Schedules</span>
                </Link>
              </motion.div>
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
            Overview & Cadres
          </button>
          <button 
            className={`course-tab-btn ${activeTab === 'scheme' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheme')}
          >
            Exam Pattern & Marks
          </button>
          <button 
            className={`course-tab-btn ${activeTab === 'eligibility' ? 'active' : ''}`}
            onClick={() => setActiveTab('eligibility')}
          >
            Eligibility & Age
          </button>
          <button 
            className={`course-tab-btn ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            Batch Highlights
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
                    <h4 className="mb-3">About Group II Services</h4>
                    <p>
                      TNPSC Group II services recruit officers who handle key regulatory, taxation, and administrative functions in the state. From executing property deeds as Sub-Registrars to drafting government orders as Assistant Section Officers in the Secretariat, these officers form the backbone of the state executive machinery.
                    </p>
                  </div>

                  <div className="academic-card">
                    <h4 className="mb-3">Key Cadre Postings</h4>
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
                    <div className="card-kicker">Quick Snapshot</div>
                    <h5 className="mb-3">Group 2 Summary</h5>
                    <div className="d-flex justify-content-between py-2 border-bottom small">
                      <span className="text-muted">Qualification:</span>
                      <strong>Any Bachelor Degree</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom small">
                      <span className="text-muted">Age Limit:</span>
                      <strong>18 to 32+ Years</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom small">
                      <span className="text-muted">Mode of Exam:</span>
                      <strong>Offline OMR / Written</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 small">
                      <span className="text-muted">Oral Interview:</span>
                      <strong>40 Marks</strong>
                    </div>

                    <div className="mt-4">
                      <Link to="/Student-Register" className="btn-primary-custom w-100 text-center">
                        Enroll for 2026
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scheme' && (
              <div className="row g-4">
                <div className="col-12">
                  <div className="academic-card mb-4">
                    <h4 className="mb-3">Stage I: Preliminary Examination</h4>
                    <p className="text-muted small">Single paper (Objective Type) for 300 marks.</p>
                    <div className="table-responsive">
                      <table className="academic-table">
                        <thead>
                          <tr>
                            <th>Subject</th>
                            <th>Questions</th>
                            <th>Total Marks</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>General Studies (Degree Standard) + Aptitude</td>
                            <td>200 Qs (175 GS + 25 Aptitude)</td>
                            <td>300 Marks</td>
                            <td>3 Hours</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="academic-card">
                    <h4 className="mb-3">Stage II: Main Written Examination & Interview</h4>
                    <div className="table-responsive">
                      <table className="academic-table">
                        <thead>
                          <tr>
                            <th>Paper</th>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>Paper I (Tamil Eligibility)</strong></td>
                            <td>Descriptive (SSLC Standard)</td>
                            <td>3 Hours</td>
                            <td>100 Marks (Qualifying min. 40)</td>
                          </tr>
                          <tr>
                            <td><strong>Paper II (General Studies)</strong></td>
                            <td>Descriptive (Degree Standard)</td>
                            <td>3 Hours</td>
                            <td>300 Marks</td>
                          </tr>
                          <tr>
                            <td><strong>Stage III: Interview</strong></td>
                            <td>Oral Interview & Record</td>
                            <td>-</td>
                            <td>40 Marks</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'eligibility' && (
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="academic-card h-100">
                    <h4 className="mb-3">Educational Qualification</h4>
                    <p className="small text-muted">
                      Candidates must hold a Bachelor’s degree from a recognized university. For specific posts such as Sub-Registrar and Probation Officer, preference is given to Law and Sociology/Criminology graduates.
                    </p>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="academic-card h-100">
                    <h4 className="mb-3">Age Limit</h4>
                    <p className="small text-muted mb-2">
                      Minimum age: <strong>18 Years</strong> (21 for Sub-Registrar Grade II).
                    </p>
                    <p className="small text-muted">
                      Maximum age: No upper age limit for SC/ST/MBC/BC candidates holding a degree. For Others/General category, maximum age is <strong>32 Years</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="academic-card">
                <h4 className="mb-3">Bharathi Academy Advantage for Group 2</h4>
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <h6 className="fw-bold mb-1">Mains Special Batch</h6>
                      <p className="small text-muted mb-0">Thorough training on government schemes, socioeconomic problems, and science & technology.</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <h6 className="fw-bold mb-1">Interview Guidance Bureau</h6>
                      <p className="small text-muted mb-0">Mock interviews conducted by retired and serving IAS/Group 1 officers with detailed feedback.</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <h6 className="fw-bold mb-1">Zero Tuition Cost</h6>
                      <p className="small text-muted mb-0">All coaching sessions are 100% free of charge as part of our academy service initiative.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Group2;
