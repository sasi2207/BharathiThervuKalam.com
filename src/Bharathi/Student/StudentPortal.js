import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../img1/Logo.png';
import '../OMR/OMRSheet.css';
import '../Admin/AdminDashboard.css';

const StudentPortal = () => {
  const navigate = useNavigate();

  return (
    <div className="student-portal-page py-5" style={{ backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="site-container">
        {/* Hero Welcome */}
        <div
          className="card border-0 rounded-4 shadow-lg text-white p-4 p-md-5 mb-5 overflow-hidden position-relative"
          style={{ background: 'linear-gradient(135deg, #0b1a30 0%, #17325c 100%)' }}
        >
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-8">
              <div className="d-flex align-items-center gap-2 text-warning small fw-bold text-uppercase mb-2">
                <i className="bi bi-mortarboard-fill"></i>
                <span>Bharathi Academy Student Portal</span>
              </div>
              <h1 className="fw-bold text-white mb-3">
                Student Examination & Performance Portal
              </h1>
              <p className="text-light opacity-75 mb-4" style={{ maxWidth: '640px' }}>
                Your dedicated workspace for weekly TNPSC and TNUSRB test series, digital OMR practice sheets, automated score validation, question paper downloads, and official answer keys.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/student-dashboard" className="btn btn-warning btn-lg fw-bold px-4 py-2 text-dark shadow">
                    <i className="bi bi-speedometer2 me-2"></i> Enter Student Dashboard
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/Student-Login" className="btn btn-outline-light btn-lg fw-semibold px-4 py-2">
                    <i className="bi bi-box-arrow-in-right me-2"></i> Student Sign In
                  </Link>
                </motion.div>
              </div>
            </div>

            <div className="col-12 col-lg-4 text-center">
              <div className="bg-white-10 p-4 rounded-4 border border-white-20 backdrop-blur">
                <img src={Logo} alt="Logo" style={{ height: '70px', width: 'auto' }} className="mb-3" />
                <h5 className="fw-bold text-white mb-1">Statewide Test Batches</h5>
                <p className="small text-light opacity-75 mb-3">
                  100% Free Mentorship · Serving Officer Faculty
                </p>
                <div className="d-flex justify-content-around text-center border-top border-white-20 pt-3">
                  <div>
                    <div className="fw-bold text-warning fs-5">130+</div>
                    <div className="small text-light opacity-75">Selections</div>
                  </div>
                  <div>
                    <div className="fw-bold text-warning fs-5">Weekly</div>
                    <div className="small text-light opacity-75">OMR Drills</div>
                  </div>
                  <div>
                    <div className="fw-bold text-warning fs-5">Statewide</div>
                    <div className="small text-light opacity-75">Rank Lists</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="row g-4 mb-5">
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm p-4 rounded-3 h-100 bg-white">
              <span className="admin-stat-icon blue mb-3" style={{ width: '48px', height: '48px', fontSize: '1.4rem' }}>
                <i className="bi bi-ui-checks-grid"></i>
              </span>
              <h5 className="fw-bold text-dark mb-2">Digital OMR Sheet Simulator</h5>
              <p className="small text-muted mb-4">
                Experience authentic bubble shading on our TNPSC & TNUSRB simulator with active countdown timer and option count validation.
              </p>
              <Link to="/student-dashboard" className="btn btn-outline-primary btn-sm fw-bold mt-auto">
                Practice OMR Bubbling →
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm p-4 rounded-3 h-100 bg-white">
              <span className="admin-stat-icon green mb-3" style={{ width: '48px', height: '48px', fontSize: '1.4rem' }}>
                <i className="bi bi-shield-check"></i>
              </span>
              <h5 className="fw-bold text-dark mb-2">Automated OMR Validation</h5>
              <p className="small text-muted mb-4">
                Validate your marked OMR sheets against official master keys. Receive instantaneous scores, statewide simulated rank, and detailed question solutions.
              </p>
              <Link to="/student-dashboard" className="btn btn-outline-success btn-sm fw-bold mt-auto">
                Validate My OMR Sheet →
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm p-4 rounded-3 h-100 bg-white">
              <span className="admin-stat-icon orange mb-3" style={{ width: '48px', height: '48px', fontSize: '1.4rem' }}>
                <i className="bi bi-file-earmark-pdf"></i>
              </span>
              <h5 className="fw-bold text-dark mb-2">Question Papers & Solutions</h5>
              <p className="small text-muted mb-4">
                Download model question papers, answer keys with explanations, and weekly Saturday / Sunday examination schedules.
              </p>
              <Link to="/Test-Series" className="btn btn-outline-warning text-dark btn-sm fw-bold mt-auto">
                View Test Series & PDFs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
