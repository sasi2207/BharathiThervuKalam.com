import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './img1/Logo.png';
import Swal from 'sweetalert2';
import { coursesApi, studentApi } from './Api/Api';

export default function Topnav() {
  const [activeTab, setActiveTab] = useState('all');
  const [coursesList, setCoursesList] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    targetExam: 'TNPSC Group 4',
    qualification: 'Any Degree'
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    coursesApi.getAll().then(res => {
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const streams = {};
      const routeMap = {
        group1: '/Group1',
        group2: '/Group2',
        group2A: '/Group-2A',
        group4: '/Group4',
        jointRecruitment: '/JointRecritment',
        siTechnical: '/Si-Recruitment',
        siFingerprint: '/Si-FingerFrint',
        commonRecruitment: '/Common'
      };

      data.forEach(c => {
        const key = c.course_key || 'group1';
        if (!streams[key]) {
          const cat = (c.category || '').toLowerCase();
          streams[key] = {
            id: c.id,
            category: cat.includes('tnusrb') ? 'tnusrb' : 'tnpsc',
            title: c.title,
            subtitle: c.subject || c.department || 'Examination Guidance Batch',
            qualification: c.qualification || (key === 'group4' || key === 'commonRecruitment' ? '10th Standard (SSLC) / Higher' : 'Any Bachelor Degree'),
            ageLimit: c.age_limit || (cat.includes('tnusrb') ? '20 to 30 Years' : '18 to 39 Years'),
            scheme: c.paper ? `${c.paper} · ${c.subject}` : 'Preliminary & Main Examination Scheme',
            link: routeMap[key] || '/Group1',
            badge: cat.includes('tnusrb') ? 'Uniformed Service' : 'State Civil Service'
          };
        }
      });
      setCoursesList(Object.values(streams));
      setLoadingCourses(false);
    }).catch(err => {
      console.warn('Error loading courses from database:', err);
      setLoadingCourses(false);
    });
  }, []);

  const handleDownload = (filename, label) => {
    const link = document.createElement('a');
    link.href = `/${encodeURIComponent(filename)}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: 'success',
      title: 'Download Initiated',
      text: `${label} is now downloading. Best wishes for your exam preparation!`,
      timer: 2500,
      showConfirmButton: false
    });
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields',
        text: 'Please enter your name and contact phone number.'
      });
      return;
    }

    setFormSubmitting(true);
    try {
      await studentApi.create({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || `${formData.phone}@inquiry.bharathithervukalam.com`,
        qualification: formData.qualification,
        target_exam: formData.targetExam,
        source: 'Website Admission Inquiry',
        status: 'INQUIRY'
      });
    } catch (e) {}

    setFormSubmitting(false);
    Swal.fire({
      icon: 'success',
      title: 'Admission Inquiry Submitted',
      html: `Thank you <b>${formData.name}</b>! Our mentor team from Bharathi Academy will contact you at <b>${formData.phone}</b> with batch timings and study materials for <b>${formData.targetExam}</b>.`,
      confirmButtonColor: '#0b1e42'
    });
    setFormData({
      name: '',
      phone: '',
      email: '',
      targetExam: 'TNPSC Group 4',
      qualification: 'Any Degree'
    });
  };

  const courses = coursesList;

  const filteredCourses = activeTab === 'all' 
    ? courses 
    : courses.filter(c => c.category === activeTab);

  return (
    <div className="home-page-container" style={{ backgroundColor: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Component Styles */}
      <style>{`
        /* Hero Section */
        .hero-banner-section {
          background: linear-gradient(135deg, #06182c 0%, #0d274d 60%, #173868 100%);
          color: #ffffff;
          padding: 65px 0;
        }

        /* Section Specific Backgrounds */
        .section-downloads {
          background-color: #fbfcfd;
          border-bottom: 1px solid #e9ecef;
          padding: 60px 0;
        }

        .section-courses {
          background: linear-gradient(180deg, #f1f5f9 0%, #e8edf4 100%);
          border-bottom: 1px solid #e2e8f0;
          padding: 65px 0;
        }

        .section-pillars {
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 65px 0;
        }

        .section-inquiry {
          background: linear-gradient(140deg, #091a36 0%, #11284d 50%, #1a3a6b 100%);
          color: #ffffff;
          padding: 70px 0;
        }

        /* Card Styles */
        .academic-card {
          background-color: #ffffff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.5rem;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }

        .pillar-card-1 {
          background-color: #fefcf3 !important;
          border-color: #fef08a !important;
        }
        .pillar-card-2 {
          background-color: #f0fdf4 !important;
          border-color: #bbf7d0 !important;
        }
        .pillar-card-3 {
          background-color: #f0f9ff !important;
          border-color: #bae6fd !important;
        }
        .pillar-card-4 {
          background-color: #faf5ff !important;
          border-color: #e9d5ff !important;
        }

        /* Inputs & Dropdowns */
        .form-control-custom,
        select.form-control-custom {
          background-color: #ffffff !important;
          color: #0f172a !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 8px;
          padding: 0.65rem 0.85rem;
          width: 100%;
          font-size: 0.92rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .form-control-custom:focus,
        select.form-control-custom:focus {
          outline: none;
          border-color: #d97706 !important;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15) !important;
        }

        select.form-control-custom option {
          background-color: #ffffff !important;
          color: #0f172a !important;
        }

        /* Buttons */
        .btn-gold-custom {
          background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 0.65rem 1.3rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
          box-shadow: 0 4px 10px rgba(217, 119, 6, 0.2);
        }

        .btn-gold-custom:hover {
          color: #ffffff;
          box-shadow: 0 6px 14px rgba(217, 119, 6, 0.3);
        }

        .btn-primary-custom {
          background-color: #0b1e42;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 0.65rem 1.25rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .btn-emerald-custom {
          background-color: #059669;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 0.65rem 1.25rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .btn-outline-custom {
          border: 1px solid #0b1e42;
          color: #0b1e42;
          background-color: transparent;
          border-radius: 8px;
          padding: 0.6rem 1.2rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-outline-custom:hover {
          background-color: #0b1e42;
          color: #ffffff !important;
        }

        /* Pill Badges */
        .stat-metric-pill {
          background-color: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 0.8rem 0.5rem;
          text-align: center;
          backdrop-filter: blur(6px);
        }

        .stat-metric-number {
          font-size: 1.55rem;
          font-weight: 800;
          color: #fbbf24;
        }

        .stat-metric-label {
          font-size: 0.74rem;
          color: #e2e8f0;
          margin-top: 2px;
        }

        @media (max-width: 768px) {
          .hero-banner-section, 
          .section-downloads, 
          .section-courses, 
          .section-pillars, 
          .section-inquiry {
            padding: 42px 0;
          }
        }
      `}</style>

      {/* 1. Hero Section (Deep Oceanic Navy Palette) */}
      <section className="hero-banner-section overflow-hidden">
        <div className="site-container">
          <div className="row align-items-center g-4 g-lg-5">
            <div 
              className="col-12 col-lg-7"
              data-aos="fade-right"
              data-aos-duration="800"
            >
              <div className="hero-content">
                <div className="hero-kicker mb-2" data-aos="fade-down" data-aos-delay="100">
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <span className="tamil-text fw-semibold text-warning">வெற்றியின் முதல் படி ! · Premier Coaching Since 2017</span>
                </div>

                <h1 className="hero-title fw-bold text-white mb-3" data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'calc(1.7rem + 1.2vw)', letterSpacing: '-0.02em' }}>
                  Empowering Aspirants for <span style={{ color: '#fbbf24' }}>TNPSC & Police</span> Careers.
                </h1>

                <p className="hero-description text-light opacity-90 mb-4" data-aos="fade-up" data-aos-delay="300" style={{ lineHeight: '1.7', fontSize: '1.02rem' }}>
                  Founded by passionate serving State Government Officers in Erode. Offering 100% free foundational classroom training, weekly statewide OMR test series, and dedicated mentorship for candidates across Tamil Nadu.
                </p>

                {/* Key Action Buttons */}
                <div className="d-flex flex-wrap align-items-center gap-3 mb-4" data-aos="fade-up" data-aos-delay="400">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                    <Link to="/Student-Register" className="btn-gold-custom">
                      <i className="bi bi-pencil-square"></i>
                      <span>Join 2026 Admission Batch</span>
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                    <Link to="/Test-Series" className="btn-outline-custom text-white border-light">
                      <i className="bi bi-calendar3"></i>
                      <span>2026 Test Schedule</span>
                    </Link>
                  </motion.div>
                </div>

                {/* Quantitative Metric Strip */}
                <div className="row g-2 g-sm-3 pt-3 border-top border-light border-opacity-25" data-aos="fade-up" data-aos-delay="500">
                  <div className="col-6 col-sm-3">
                    <motion.div whileHover={{ y: -3 }} className="stat-metric-pill">
                      <div className="stat-metric-number">130+</div>
                      <div className="stat-metric-label">Selected Officers</div>
                    </motion.div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <motion.div whileHover={{ y: -3 }} className="stat-metric-pill">
                      <div className="stat-metric-number">100%</div>
                      <div className="stat-metric-label">Free Classes</div>
                    </motion.div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <motion.div whileHover={{ y: -3 }} className="stat-metric-pill">
                      <div className="stat-metric-number">7+</div>
                      <div className="stat-metric-label">Years of Service</div>
                    </motion.div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <motion.div whileHover={{ y: -3 }} className="stat-metric-pill">
                      <div className="stat-metric-number">15K+</div>
                      <div className="stat-metric-label">OMRs Evaluated</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Emblem & Badge Showcase */}
            <div 
              className="col-12 col-lg-5 text-center"
              data-aos="zoom-in"
              data-aos-duration="900"
              data-aos-delay="200"
            >
              <div 
                className="p-4 p-md-5 rounded-4 mx-auto"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  maxWidth: '420px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
                }}
              >
                <motion.img 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  src={Logo} 
                  alt="பாரதி தேர்வுக்களம் சின்னம்" 
                  className="img-fluid mb-3"
                  style={{ maxHeight: '160px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))' }}
                />
                <h4 className="text-white mb-1 tamil-text fw-bold">பாரதி தேர்வுக்களம்</h4>
                <p className="text-warning small text-uppercase mb-3 fw-semibold" style={{ letterSpacing: '0.08em' }}>
                  Erode Headquarters · Tamil Nadu
                </p>
                <div className="p-3 rounded-3 text-start small" style={{ background: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div className="d-flex align-items-center gap-2 text-light mb-2">
                    <i className="bi bi-check-circle-fill text-success flex-shrink-0"></i>
                    <span>Classes conducted by serving Govt. officials</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-light mb-2">
                    <i className="bi bi-check-circle-fill text-success flex-shrink-0"></i>
                    <span>Weekly Saturday & Sunday offline test batches</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-light">
                    <i className="bi bi-check-circle-fill text-success flex-shrink-0"></i>
                    <span>Comprehensive bilingual Tamil & English materials</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Official 2026 Test Schedules & OMR Downloads (Clean Crisp Ivory) */}
      <section className="section-downloads">
        <div className="site-container">
          <div 
            className="section-header text-center mx-auto mb-5" 
            style={{ maxWidth: '700px' }}
            data-aos="fade-up"
          >
            <div className="text-warning text-uppercase fw-bold small mb-1" style={{ letterSpacing: '0.06em' }}>
              Examinations & Test Series
            </div>
            <h2 className="fw-bold text-dark mb-2">2026 Test Batch Schedules & OMR Sheets</h2>
            <p className="text-secondary mx-auto">
              Download the official timetables and practice with standardized Tamil Nadu Public Service Commission OMR sheets.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Card 1 */}
            <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">
              <motion.div 
                whileHover={{ y: -6, boxShadow: '0 16px 32px rgba(11, 30, 66, 0.1)' }}
                className="academic-card text-center"
              >
                <div className="text-primary small fw-bold text-uppercase mb-1">Weekly Batch</div>
                <h4 className="fw-bold text-dark mb-2">Saturday Test Series 2026</h4>
                <p className="small text-muted flex-grow-1">
                  Complete test timetable covering Group 1, Group 2/2A, and Police SI syllabus with weekly unit tests.
                </p>
                <div className="d-flex align-items-center justify-content-center gap-2 text-danger small mb-3">
                  <i className="bi bi-file-earmark-pdf-fill fs-5"></i>
                  <span className="fw-medium">SATURDAY TIME TABLE-1.pdf</span>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload('SATURDAY TIME TABLE-1.pdf', 'Saturday Test Schedule')}
                  className="btn-primary-custom w-100"
                >
                  <i className="bi bi-download"></i>
                  <span>Download Schedule</span>
                </motion.button>
              </motion.div>
            </div>

            {/* Card 2 */}
            <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="200">
              <motion.div 
                whileHover={{ y: -6, boxShadow: '0 16px 32px rgba(217, 119, 6, 0.16)' }}
                className="academic-card text-center"
                style={{ borderColor: '#fed7aa' }}
              >
                <div className="text-warning small fw-bold text-uppercase mb-1">Special Batch</div>
                <h4 className="fw-bold text-dark mb-2">Sunday Group 4 Schedule 2026</h4>
                <p className="small text-muted flex-grow-1">
                  Dedicated test curriculum for TNPSC Group IV & VAO aspirants covering General Tamil and General Studies.
                </p>
                <div className="d-flex align-items-center justify-content-center gap-2 text-danger small mb-3">
                  <i className="bi bi-file-earmark-pdf-fill fs-5"></i>
                  <span className="fw-medium">SUNDAY GRP 4 SCHEDULE -2026.pdf</span>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload('SUNDAY GRP 4 SCHEDULE -2026.pdf', 'Sunday Group 4 Schedule')}
                  className="btn-gold-custom w-100"
                >
                  <i className="bi bi-download"></i>
                  <span>Download Schedule</span>
                </motion.button>
              </motion.div>
            </div>

            {/* Card 3 */}
            <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="300">
              <motion.div 
                whileHover={{ y: -6, boxShadow: '0 16px 32px rgba(16, 185, 129, 0.12)' }}
                className="academic-card text-center"
                style={{ borderColor: '#a7f3d0' }}
              >
                <div className="text-success small fw-bold text-uppercase mb-1">Standard Practice</div>
                <h4 className="fw-bold text-dark mb-2">Official TNPSC OMR Sheet</h4>
                <p className="small text-muted flex-grow-1">
                  Standard 200-question practice bubble sheet replicating the authentic exam hall environment.
                </p>
                <div className="d-flex align-items-center justify-content-center gap-2 text-danger small mb-3">
                  <i className="bi bi-file-earmark-pdf-fill fs-5"></i>
                  <span className="fw-medium">Tnpsc - OMR Sheet-1.pdf</span>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload('Tnpsc - OMR Sheet-1.pdf', 'TNPSC OMR Sheet')}
                  className="btn-emerald-custom w-100"
                >
                  <i className="bi bi-download"></i>
                  <span>Download OMR Sheet</span>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Courses Spectrum (Slate Mist / Cool Ice Blue) */}
      <section className="section-courses">
        <div className="site-container">
          <div 
            className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3"
            data-aos="fade-up"
          >
            <div>
              <div className="text-warning text-uppercase fw-bold small mb-1" style={{ letterSpacing: '0.06em' }}>
                Comprehensive Programs
              </div>
              <h2 className="fw-bold text-dark mb-1">State Government Examination Coaching</h2>
              <p className="text-secondary mb-0">Structured pedagogy aligned with the latest syllabus notifications.</p>
            </div>

            {/* Filter Tabs */}
            <div className="d-inline-flex p-1 bg-white border rounded-3 shadow-sm align-self-start align-self-md-auto">
              <button 
                onClick={() => setActiveTab('all')}
                className={`btn btn-sm ${activeTab === 'all' ? 'btn-dark fw-bold shadow-sm' : 'btn-light border-0 text-muted'} px-3 py-1 fs-7`}
                style={{ backgroundColor: activeTab === 'all' ? '#0b1e42' : 'transparent', color: activeTab === 'all' ? '#ffffff' : '#64748b' }}
              >
                All Courses
              </button>
              <button 
                onClick={() => setActiveTab('tnpsc')}
                className={`btn btn-sm ${activeTab === 'tnpsc' ? 'btn-dark fw-bold shadow-sm' : 'btn-light border-0 text-muted'} px-3 py-1 fs-7`}
                style={{ backgroundColor: activeTab === 'tnpsc' ? '#0b1e42' : 'transparent', color: activeTab === 'tnpsc' ? '#ffffff' : '#64748b' }}
              >
                TNPSC Exams
              </button>
              <button 
                onClick={() => setActiveTab('tnusrb')}
                className={`btn btn-sm ${activeTab === 'tnusrb' ? 'btn-dark fw-bold shadow-sm' : 'btn-light border-0 text-muted'} px-3 py-1 fs-7`}
                style={{ backgroundColor: activeTab === 'tnusrb' ? '#0b1e42' : 'transparent', color: activeTab === 'tnusrb' ? '#ffffff' : '#64748b' }}
              >
                TNUSRB Police
              </button>
            </div>
          </div>

          <motion.div layout className="row g-4">
            <AnimatePresence>
              {filteredCourses.map((course, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="col-12 col-md-6 col-lg-3" 
                  key={course.id}
                  data-aos="fade-up"
                  data-aos-delay={(idx % 4) * 100}
                >
                  <motion.div 
                    whileHover={{ y: -6, boxShadow: '0 14px 28px rgba(11, 30, 66, 0.1)' }}
                    className="academic-card"
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-primary bg-opacity-10 text-primary fw-bold" style={{ fontSize: '0.7rem' }}>
                        {course.category.toUpperCase()}
                      </span>
                      <span className="badge bg-light text-secondary border" style={{ fontSize: '0.7rem' }}>
                        {course.badge}
                      </span>
                    </div>

                    <h4 className="fs-5 fw-bold text-dark mb-1">{course.title}</h4>
                    <div className="text-secondary small fw-medium mb-3" style={{ minHeight: '38px' }}>
                      {course.subtitle}
                    </div>

                    <div className="border-top pt-2 mt-auto">
                      <div className="d-flex justify-content-between small text-muted mb-1">
                        <span>Eligibility:</span>
                        <strong className="text-dark">{course.qualification}</strong>
                      </div>
                      <div className="d-flex justify-content-between small text-muted mb-3">
                        <span>Age Limit:</span>
                        <strong className="text-dark">{course.ageLimit}</strong>
                      </div>

                      <Link to={course.link} className="btn-outline-custom w-100 text-center py-2 fs-7">
                        <span>View Syllabus & Details</span>
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 4. Why Choose Us (Light Tinted Specialty Pillars) */}
      <section className="section-pillars">
        <div className="site-container">
          <div 
            className="section-header text-center mx-auto mb-5" 
            style={{ maxWidth: '720px' }}
            data-aos="fade-up"
          >
            <div className="text-warning text-uppercase fw-bold small mb-1" style={{ letterSpacing: '0.06em' }}>
              Why Choose Us
            </div>
            <h2 className="fw-bold text-dark mb-2">Built on Service, Mentorship & Integrity</h2>
            <p className="text-secondary mx-auto">
              We operate purely with the intent to support aspiring candidates and create a meaningful social impact through State service.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-3" data-aos="zoom-in" data-aos-delay="100">
              <motion.div whileHover={{ y: -4 }} className="academic-card pillar-card-1 h-100">
                <div className="text-warning fs-2 mb-3">
                  <i className="bi bi-people-fill"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Serving Officer Mentors</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: '1.6' }}>
                  Classes are directly handled by alumni and officers currently serving across Tamil Nadu Government departments, giving you real frontline insights.
                </p>
              </motion.div>
            </div>

            <div className="col-12 col-md-6 col-lg-3" data-aos="zoom-in" data-aos-delay="200">
              <motion.div whileHover={{ y: -4 }} className="academic-card pillar-card-2 h-100">
                <div className="text-success fs-2 mb-3">
                  <i className="bi bi-gift-fill"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">100% Free Coaching</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: '1.6' }}>
                  No tuition fees are charged. Education is completely free of cost to eliminate financial obstacles for rural and economically weak candidates.
                </p>
              </motion.div>
            </div>

            <div className="col-12 col-md-6 col-lg-3" data-aos="zoom-in" data-aos-delay="300">
              <motion.div whileHover={{ y: -4 }} className="academic-card pillar-card-3 h-100">
                <div className="text-primary fs-2 mb-3">
                  <i className="bi bi-journal-check"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Rigorous OMR Tests</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: '1.6' }}>
                  Weekly offline test batches on Saturdays and Sundays replicate the strict exam atmosphere, complete with detailed error analysis.
                </p>
              </motion.div>
            </div>

            <div className="col-12 col-md-6 col-lg-3" data-aos="zoom-in" data-aos-delay="400">
              <motion.div whileHover={{ y: -4 }} className="academic-card pillar-card-4 h-100">
                <div className="text-danger fs-2 mb-3">
                  <i className="bi bi-trophy-fill"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">130+ Proven Selections</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: '1.6' }}>
                  Our successful students now serve as Deputy Collectors, Sub-Inspectors, Municipal Commissioners, Revenue Officials, and VAOs across Tamil Nadu.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Admission & Inquiry Form (Midnight Blue & Crisp Form Contrast) */}
      <section className="section-inquiry">
        <div className="site-container">
          <div className="row align-items-center g-4 g-lg-5">
            {/* Left Column Information */}
            <div className="col-12 col-lg-6" data-aos="fade-right" data-aos-delay="200">
              <div className="text-warning text-uppercase fw-bold small mb-2" style={{ letterSpacing: '0.06em' }}>
                Enrollment Open 2026
              </div>
              <h2 className="fw-bold text-white mb-3" style={{ fontSize: 'calc(1.5rem + 1vw)' }}>
                Take the First Step to Your Government Career
              </h2>
              <p className="text-light opacity-90 mb-4" style={{ lineHeight: '1.7', fontSize: '1rem' }}>
                Whether you are starting with Group 4 or aiming for Group 1 Deputy Collector, Bharathi Academy provides complete guidance, library support, and weekly test series.
              </p>

              <div className="d-flex flex-column gap-3 small text-light">
                <div className="d-flex align-items-center gap-3">
                  <span className="p-2 rounded-circle bg-white bg-opacity-10 text-warning">
                    <i className="bi bi-geo-alt-fill fs-6"></i>
                  </span>
                  <span><strong>Campus Location:</strong> Erode, Tamil Nadu</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="p-2 rounded-circle bg-white bg-opacity-10 text-success">
                    <i className="bi bi-whatsapp fs-6"></i>
                  </span>
                  <span><strong>WhatsApp Helpline:</strong> +91 7338757194 / +91 8012194136</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="p-2 rounded-circle bg-white bg-opacity-10 text-info">
                    <i className="bi bi-clock-fill fs-6"></i>
                  </span>
                  <span><strong>Batch Timings:</strong> Weekend & Regular Test Batches</span>
                </div>
              </div>
            </div>

            {/* Right Column Form with pure white inputs & dropdowns */}
            <div className="col-12 col-lg-6" data-aos="fade-left" data-aos-delay="300">
              <form 
                onSubmit={handleInquirySubmit} 
                className="p-4 p-md-5 rounded-4 shadow-lg border-0"
                style={{ backgroundColor: '#ffffff' }}
              >
                <h4 className="mb-3 fw-bold text-dark">Admission & Guidance Request</h4>
                <p className="text-muted small mb-4">Leave your details for direct counseling and schedule allotment.</p>

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold text-secondary mb-1">Candidate Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Your Full Name"
                      className="form-control-custom"
                      required
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold text-secondary mb-1">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="+91 Mobile Number"
                      className="form-control-custom"
                      required
                    />
                  </div>

                  {/* Dropdown 1 */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold text-secondary mb-1">Target Examination</label>
                    <select 
                      name="targetExam"
                      value={formData.targetExam}
                      onChange={handleFormChange}
                      className="form-control-custom"
                    >
                      <option value="TNPSC Group 1">TNPSC Group 1</option>
                      <option value="TNPSC Group 2 / 2A">TNPSC Group 2 / 2A</option>
                      <option value="TNPSC Group 4 & VAO">TNPSC Group 4 & VAO</option>
                      <option value="TNUSRB SI Technical">TNUSRB SI Technical</option>
                      <option value="TNUSRB SI Fingerprint">TNUSRB SI Fingerprint</option>
                      <option value="TNUSRB Joint SI Recruitment">TNUSRB Joint SI Recruitment</option>
                      <option value="TNUSRB Police Constable">TNUSRB Police Constable</option>
                    </select>
                  </div>

                  {/* Dropdown 2 */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold text-secondary mb-1">Highest Qualification</label>
                    <select 
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleFormChange}
                      className="form-control-custom"
                    >
                      <option value="Any Degree">Any Bachelor's Degree</option>
                      <option value="Post Graduate">Post Graduate (PG)</option>
                      <option value="Engineering (B.E/B.Tech)">Engineering (B.E/B.Tech)</option>
                      <option value="Diploma">Diploma / Polytechnic</option>
                      <option value="12th Standard">12th Standard / HSC</option>
                      <option value="10th Standard">10th Standard / SSLC</option>
                    </select>
                  </div>

                  <div className="col-12 mt-4">
                    <motion.button 
                      whileTap={{ scale: 0.97 }}
                      type="submit" 
                      disabled={formSubmitting}
                      className="btn-gold-custom w-100 py-2 fs-6 fw-bold"
                    >
                      {formSubmitting ? 'Submitting...' : 'Submit Admission Inquiry'}
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}