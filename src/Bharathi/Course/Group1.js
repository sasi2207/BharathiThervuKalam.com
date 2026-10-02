import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Group.css';

const Group1 = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const postings = [
    'Deputy Collector (Tamil Nadu Civil Service)',
    'Deputy Superintendent of Police (DSP Category-I)',
    'Assistant Commissioner (Commercial Taxes)',
    'Deputy Registrar of Co-operative Societies',
    'Assistant Director of Rural Development',
    'District Registrar (Registration Dept)',
    'Assistant Commissioner (HR & CE Dept)',
    'Divisional Officer (Fire & Rescue Services)',
    'Assistant Conservator of Forest',
    'District Employment Officer'
  ];

  return (
    <div className="course-detail-page">
      {/* Course Hero */}
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
              <span className="text-light">TNPSC Group 1</span>
            </div>

            <h1 className="text-white mb-2 fw-bold">TNPSC Group I Services</h1>
            <p className="text-light opacity-75 mb-4" style={{ maxWidth: '750px' }}>
              Premier administrative examination conducted by the Tamil Nadu Public Service Commission for entry into top state administrative cadres.
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/Student-Register" className="btn-gold-custom">
                  <i className="bi bi-pencil-square"></i>
                  <span>Enroll in Group 1 Batch</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/Test-Series" className="btn-outline-custom text-white border-light">
                  <i className="bi bi-file-earmark-pdf"></i>
                  <span>Saturday Test Series</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Tabs & Content */}
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
            Exam Scheme & Pattern
          </button>
          <button 
            className={`course-tab-btn ${activeTab === 'eligibility' ? 'active' : ''}`}
            onClick={() => setActiveTab('eligibility')}
          >
            Eligibility & Age
          </button>
          <button 
            className={`course-tab-btn ${activeTab === 'coaching' ? 'active' : ''}`}
            onClick={() => setActiveTab('coaching')}
          >
            Bharathi Academy Coaching
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
            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="row g-4">
                <div className="col-12 col-lg-8">
                  <div className="academic-card mb-4">
                    <h4 className="mb-3">About TNPSC Group I Examination</h4>
                    <p>
                      The Tamil Nadu Public Service Commission conducts the Group I examination to directly recruit civil servants to high-level administrative posts under the Government of Tamil Nadu. It is the state equivalent of the UPSC Civil Services Examination.
                    </p>
                    <p>
                      Recruited officers undergo comprehensive administrative and police academy training before being posted as executive magistrates, district revenue heads, and police sub-divisional heads.
                    </p>
                  </div>

                  <div className="academic-card">
                    <h4 className="mb-3">Posts & Cadres Recruited</h4>
                    <div className="row g-2">
                      {postings.map((post, idx) => (
                        <div className="col-12 col-md-6" key={idx}>
                          <motion.div whileHover={{ x: 3 }} className="posting-chip">
                            <i className="bi bi-shield-check text-warning"></i>
                            <span>{post}</span>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-4">
                  <div className="academic-card bg-light">
                    <div className="card-kicker">Quick Summary</div>
                    <h5 className="mb-3">Group 1 at a Glance</h5>
                    
                    <div className="d-flex justify-content-between py-2 border-bottom small">
                      <span className="text-muted">Qualification:</span>
                      <strong>Any Bachelor's Degree</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom small">
                      <span className="text-muted">Final Year Students:</span>
                      <strong>Eligible to Apply</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom small">
                      <span className="text-muted">Min Age:</span>
                      <strong>21 Years</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom small">
                      <span className="text-muted">Max Age (SC/ST/MBC):</span>
                      <strong>39 Years</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 small">
                      <span className="text-muted">Selection Stages:</span>
                      <strong>Prelims + Mains + Interview</strong>
                    </div>

                    <div className="mt-4">
                      <Link to="/Student-Register" className="btn-primary-custom w-100 text-center">
                        Apply for Guidance
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Scheme */}
            {activeTab === 'scheme' && (
              <div className="row g-4">
                <div className="col-12">
                  <div className="academic-card mb-4">
                    <h4 className="mb-3">Stage I: Preliminary Examination (Objective Type)</h4>
                    <p className="text-muted small">
                      Single paper of 3 hours duration with 200 multiple-choice questions for 300 marks.
                    </p>

                    <div className="table-responsive">
                      <table className="academic-table">
                        <thead>
                          <tr>
                            <th>Subject</th>
                            <th>No. of Questions</th>
                            <th>Maximum Marks</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>General Studies (Degree Standard)</strong></td>
                            <td>175 Questions</td>
                            <td rowSpan="2" className="align-middle"><strong>300 Marks</strong></td>
                            <td rowSpan="2" className="align-middle"><strong>3 Hours</strong></td>
                          </tr>
                          <tr>
                            <td><strong>Aptitude & Mental Ability (SSLC Standard)</strong></td>
                            <td>25 Questions</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="academic-card mb-4">
                    <h4 className="mb-3">Stage II: Main Written Examination (Descriptive)</h4>
                    <p className="text-muted small">
                      Consists of 4 papers (Paper I Tamil Eligibility is qualifying; Papers II, III, IV count for merit ranking).
                    </p>

                    <div className="table-responsive">
                      <table className="academic-table">
                        <thead>
                          <tr>
                            <th>Paper</th>
                            <th>Subject</th>
                            <th>Duration</th>
                            <th>Maximum Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>Paper I</strong></td>
                            <td>Tamil Eligibility Test (SSLC Standard)</td>
                            <td>3 Hours</td>
                            <td>100 Marks (Qualifying)</td>
                          </tr>
                          <tr>
                            <td><strong>Paper II</strong></td>
                            <td>General Studies (Modern History, Social Issues, Aptitude)</td>
                            <td>3 Hours</td>
                            <td>250 Marks</td>
                          </tr>
                          <tr>
                            <td><strong>Paper III</strong></td>
                            <td>General Studies (Indian Polity, Science & Tech, Tamil Society)</td>
                            <td>3 Hours</td>
                            <td>250 Marks</td>
                          </tr>
                          <tr>
                            <td><strong>Paper IV</strong></td>
                            <td>General Studies (Geography, Environment, Indian Economy)</td>
                            <td>3 Hours</td>
                            <td>250 Marks</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="academic-card">
                    <h4 className="mb-2">Stage III: Oral Test / Interview</h4>
                    <p className="text-muted">
                      Personality test and interview conducted by the TNPSC board for <strong>100 Marks</strong>. Total merit marks: 750 (Mains) + 100 (Interview) = <strong>850 Marks</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Eligibility */}
            {activeTab === 'eligibility' && (
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="academic-card h-100">
                    <h4 className="mb-3">Educational Qualification</h4>
                    <ul className="text-muted small mb-0 ps-3">
                      <li className="mb-2">Must possess a degree of any of the Universities incorporated by an Act of the Central or State Legislature in India.</li>
                      <li className="mb-2">Candidates studying in final year of Degree are also eligible to apply for Preliminary Examination.</li>
                      <li className="mb-2">Preference given to candidates possessing Degree in Commerce for Assistant Commissioner of Commercial Taxes.</li>
                      <li className="mb-2">Preference given to candidates possessing National Police Academy / Criminology diploma for DSP posts.</li>
                    </ul>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="academic-card h-100">
                    <h4 className="mb-3">Age Limit Criteria</h4>
                    <div className="table-responsive">
                      <table className="academic-table">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Minimum Age</th>
                            <th>Maximum Age</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>SC / SC(A) / ST</strong></td>
                            <td>21 Years</td>
                            <td><strong>39 Years</strong></td>
                          </tr>
                          <tr>
                            <td><strong>MBC / DC / BC / BCM</strong></td>
                            <td>21 Years</td>
                            <td><strong>39 Years</strong></td>
                          </tr>
                          <tr>
                            <td><strong>Others (General)</strong></td>
                            <td>21 Years</td>
                            <td><strong>34 Years</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Coaching */}
            {activeTab === 'coaching' && (
              <div className="academic-card">
                <h4 className="mb-3">Group 1 Coaching at Bharathi Thervukalam</h4>
                <p className="text-muted">
                  Bharathi Academy offers specialized weekend and regular coaching in Erode designed specifically for the rigorous Group 1 standard:
                </p>

                <div className="row g-3 mt-2">
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <h6 className="fw-bold mb-1">Weekly Saturday Test Series</h6>
                      <p className="small text-muted mb-0">Full-length 200 question OMR mock tests followed by in-depth answer discussion by serving officers.</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <h6 className="fw-bold mb-1">Mains Answer Writing Mentorship</h6>
                      <p className="small text-muted mb-0">Daily answer writing practice with personalized feedback on presentation, data enrichment, and structure.</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <h6 className="fw-bold mb-1">100% Free Guidance</h6>
                      <p className="small text-muted mb-0">Committed to social upliftment with zero tuition fees. Nominal cost only for test paper printing.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top d-flex gap-3">
                  <Link to="/Student-Register" className="btn-gold-custom">
                    Register for Group 1 Batch
                  </Link>
                  <Link to="/Test-Series" className="btn-outline-custom">
                    Download Saturday Schedule
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Group1;
