import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './img1/Logo.png';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [mobileTnpscOpen, setMobileTnpscOpen] = useState(true);
  const [mobileTnusrbOpen, setMobileTnusrbOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setCoursesDropdownOpen(false);
    setAboutDropdownOpen(false);
    setLoginDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Main Top Header - Fixed & Highest Stacking Order (z-index: 99999) */}
      <header className="site-header-wrapper" style={{ position: 'sticky', top: 0, zIndex: 99999 }}>
        
        {/* Responsive Top Utility & Announcement Bar */}
        <div 
          className="top-announcement-bar py-1 py-sm-1"
          style={{ 
            backgroundColor: '#0a192f',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.78rem'
          }}
        >
          <div className="site-container">
            <div className="d-flex flex-row justify-content-between align-items-center gap-2 overflow-x-auto text-nowrap py-1">
              
              {/* Left Zone: Location & Contact */}
              <div className="d-flex align-items-center gap-2 gap-sm-3 flex-shrink-0">
                <span className="d-flex align-items-center gap-1 text-light">
                  <i className="bi bi-geo-alt-fill text-warning fs-8"></i>
                  <span className="fw-medium">Erode, TN</span>
                </span>
                
                <span className="text-secondary opacity-50">|</span>
                
                <a 
                  href="https://wa.me/917338757194" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="d-flex align-items-center gap-1 text-decoration-none"
                >
                  <i className="bi bi-whatsapp text-success fs-8"></i>
                  <span className="text-white">+91 7338757194</span>
                </a>

                <span className="text-secondary opacity-50 d-none d-md-inline">|</span>

                <a 
                  href="tel:+918012194136" 
                  className="d-none d-md-flex align-items-center gap-1 text-decoration-none text-light"
                >
                  <i className="bi bi-telephone text-info fs-8"></i>
                  <span>+91 8012194136</span>
                </a>
              </div>

              {/* Right Zone: Schedule & Portal Access */}
              <div className="d-flex align-items-center gap-2 gap-sm-3 flex-shrink-0">
                <Link 
                  to="/Test-Series" 
                  onClick={closeAllMenus} 
                  className="text-warning text-decoration-none fw-semibold d-flex align-items-center gap-1"
                >
                  <span 
                    className="badge bg-warning text-dark px-1 py-0 me-1 fw-bold" 
                    style={{ fontSize: '0.62rem', letterSpacing: '0.02em' }}
                  >
                    NEW
                  </span>
                  <i className="bi bi-file-earmark-pdf fs-8"></i>
                  <span>2026 Test Schedules</span>
                </Link>

                <span className="text-secondary opacity-50">|</span>

                <Link 
                  to="/Student-Login" 
                  onClick={closeAllMenus} 
                  className="text-light text-decoration-none d-flex align-items-center gap-1"
                >
                  <i className="bi bi-person-circle text-warning fs-8"></i>
                  <span>Portal Login</span>
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Main Sticky Navbar with solid white background */}
        <motion.nav 
          className="site-navbar bg-white"
          style={{ zIndex: 99999, backgroundColor: '#ffffff' }}
          animate={{
            boxShadow: scrolled 
              ? '0 10px 25px -5px rgba(11, 30, 66, 0.15), 0 4px 6px -2px rgba(11, 30, 66, 0.05)' 
              : '0 1px 3px rgba(0, 0, 0, 0.04)'
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="site-container d-flex align-items-center justify-content-between py-2">
            {/* Brand Lockup */}
            <Link to="/" onClick={closeAllMenus} className="brand-lockup">
              <motion.img 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                src={Logo} 
                alt="பாரதி தேர்வுக்களம்" 
                className="brand-logo-img" 
              />
              <div className="brand-text-wrap">
                <span className="brand-name-ta">பாரதி தேர்வுக்களம்</span>
                <span className="brand-name-en">Bharathi Academy · Erode</span>
              </div>
            </Link>

            {/* Desktop Navigation Links (>= 992px) */}
            <div className="d-none d-lg-flex align-items-center gap-1">
              <Link 
                to="/" 
                onClick={closeAllMenus} 
                className={`nav-link-custom ${isActive('/') ? 'active' : ''}`}
              >
                Home
              </Link>

              {/* Courses Dropdown */}
              <div 
                className="position-relative"
                onMouseEnter={() => setCoursesDropdownOpen(true)}
                onMouseLeave={() => setCoursesDropdownOpen(false)}
              >
                <button 
                  type="button"
                  className={`nav-link-custom border-0 bg-transparent d-flex align-items-center gap-1 ${
                    ['/Group1', '/Group2', '/Group-2A', '/Group4', '/Si-Recruitment', '/Si-FingerFrint', '/JointRecritment', '/Common'].includes(location.pathname) ? 'active' : ''
                  }`}
                  onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                >
                  <span>Courses</span>
                  <i className={`bi bi-chevron-down fs-8 transition-all ${coursesDropdownOpen ? 'rotate-180 text-warning' : ''}`}></i>
                </button>

                <AnimatePresence>
                  {coursesDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="dropdown-menu-custom bg-white shadow-xl p-3 border rounded-4 position-absolute"
                      style={{ top: '100%', left: '0', minWidth: '420px', zIndex: 999999, backgroundColor: '#ffffff' }}
                    >
                      <div className="row g-3">
                        <div className="col-6">
                          <div className="dropdown-header text-uppercase text-secondary fw-bold fs-8 mb-2 pb-1 border-bottom">
                            TNPSC Exams
                          </div>
                          <Link to="/Group1" onClick={closeAllMenus} className="dropdown-item-custom">
                            <div className="fw-semibold">Group I Services</div>
                            <small className="text-muted" style={{ fontSize: '0.72rem' }}>Deputy Collector & DSP</small>
                          </Link>
                          <Link to="/Group2" onClick={closeAllMenus} className="dropdown-item-custom">
                            <div className="fw-semibold">Group II Services</div>
                            <small className="text-muted" style={{ fontSize: '0.72rem' }}>Sub-Registrar, Municipal Comm.</small>
                          </Link>
                          <Link to="/Group-2A" onClick={closeAllMenus} className="dropdown-item-custom">
                            <div className="fw-semibold">Group II-A Services</div>
                            <small className="text-muted" style={{ fontSize: '0.72rem' }}>Secretariat & Ministerial</small>
                          </Link>
                          <Link to="/Group4" onClick={closeAllMenus} className="dropdown-item-custom">
                            <div className="fw-semibold">Group IV & VAO</div>
                            <small className="text-muted" style={{ fontSize: '0.72rem' }}>Village Admin & Clerical</small>
                          </Link>
                        </div>

                        <div className="col-6">
                          <div className="dropdown-header text-uppercase text-secondary fw-bold fs-8 mb-2 pb-1 border-bottom">
                            TNUSRB Police
                          </div>
                          <Link to="/Si-Recruitment" onClick={closeAllMenus} className="dropdown-item-custom">
                            <div className="fw-semibold">SI (Technical)</div>
                            <small className="text-muted" style={{ fontSize: '0.72rem' }}>Police Wireless Wing</small>
                          </Link>
                          <Link to="/Si-FingerFrint" onClick={closeAllMenus} className="dropdown-item-custom">
                            <div className="fw-semibold">SI (Finger Print)</div>
                            <small className="text-muted" style={{ fontSize: '0.72rem' }}>Forensic Bureau Cadre</small>
                          </Link>
                          <Link to="/JointRecritment" onClick={closeAllMenus} className="dropdown-item-custom">
                            <div className="fw-semibold">Joint Recruitment</div>
                            <small className="text-muted" style={{ fontSize: '0.72rem' }}>Taluk & AR Sub-Inspectors</small>
                          </Link>
                          <Link to="/Common" onClick={closeAllMenus} className="dropdown-item-custom">
                            <div className="fw-semibold">Common Police</div>
                            <small className="text-muted" style={{ fontSize: '0.72rem' }}>Police Constables & Warders</small>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Test Series */}
              <Link 
                to="/Test-Series" 
                onClick={closeAllMenus} 
                className={`nav-link-custom ${isActive('/Test-Series') ? 'active' : ''}`}
              >
                Test Series
              </Link>

              {/* Student Portal & OMR */}
              <Link 
                to="/student-dashboard" 
                onClick={closeAllMenus} 
                className={`nav-link-custom ${isActive('/student-dashboard') ? 'active' : ''}`}
              >
                Student Portal
              </Link>

              {/* Results & Achievers */}
              <Link 
                to="/Achivement" 
                onClick={closeAllMenus} 
                className={`nav-link-custom ${isActive('/Achivement') ? 'active' : ''}`}
              >
                Results & Achievers
              </Link>

              {/* About Dropdown */}
              <div 
                className="position-relative"
                onMouseEnter={() => setAboutDropdownOpen(true)}
                onMouseLeave={() => setAboutDropdownOpen(false)}
              >
                <button 
                  type="button"
                  className={`nav-link-custom border-0 bg-transparent d-flex align-items-center gap-1 ${
                    ['/About', '/WhyAbout', '/Faculty'].includes(location.pathname) ? 'active' : ''
                  }`}
                  onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                >
                  <span>About</span>
                  <i className={`bi bi-chevron-down fs-8 transition-all ${aboutDropdownOpen ? 'rotate-180 text-warning' : ''}`}></i>
                </button>

                <AnimatePresence>
                  {aboutDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="dropdown-menu-custom bg-white shadow-xl p-2 border rounded-3 position-absolute"
                      style={{ top: '100%', left: '0', minWidth: '220px', zIndex: 999999, backgroundColor: '#ffffff' }}
                    >
                      <Link to="/About" onClick={closeAllMenus} className="dropdown-item-custom">
                        About Bharathi Academy
                      </Link>
                      <Link to="/WhyAbout" onClick={closeAllMenus} className="dropdown-item-custom">
                        Why Choose Bharathi
                      </Link>
                      <Link to="/Faculty" onClick={closeAllMenus} className="dropdown-item-custom">
                        Faculty & Mentors
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Desktop Action Zone: Portals & CTA */}
            <div className="d-flex align-items-center gap-2">
              {/* Login Menu for Desktop */}
              <div 
                className="position-relative d-none d-md-block"
                onMouseEnter={() => setLoginDropdownOpen(true)}
                onMouseLeave={() => setLoginDropdownOpen(false)}
              >
                <button 
                  type="button"
                  className="btn-outline-custom py-2 px-3 fs-7"
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                >
                  <i className="bi bi-box-arrow-in-right"></i>
                  <span>Portals</span>
                  <i className="bi bi-chevron-down fs-8"></i>
                </button>

                <AnimatePresence>
                  {loginDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="dropdown-menu-custom bg-white shadow-xl p-2 border rounded-3 position-absolute end-0"
                      style={{ top: '100%', minWidth: '190px', zIndex: 999999, backgroundColor: '#ffffff' }}
                    >
                      <Link to="/student-dashboard" onClick={closeAllMenus} className="dropdown-item-custom">
                        <i className="bi bi-mortarboard me-2 text-warning"></i>Student Dashboard & OMR
                      </Link>
                      <Link to="/Student-Login" onClick={closeAllMenus} className="dropdown-item-custom">
                        <i className="bi bi-box-arrow-in-right me-2 text-secondary"></i>Student Login
                      </Link>
                      <Link to="/Staff-Login" onClick={closeAllMenus} className="dropdown-item-custom">
                        <i className="bi bi-person-badge me-2 text-info"></i>Staff Portal
                      </Link>
                      <Link to="/Admin-Login" onClick={closeAllMenus} className="dropdown-item-custom">
                        <i className="bi bi-shield-lock me-2 text-primary"></i>Admin Portal
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Admission CTA Button (Desktop) */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="d-none d-sm-block">
                <Link 
                  to="/Student-Register" 
                  onClick={closeAllMenus} 
                  className="btn-gold-custom py-2 px-3 fs-7"
                >
                  <i className="bi bi-pencil-square"></i>
                  <span>Apply for Admission</span>
                </Link>
              </motion.div>

              {/* Quick WhatsApp button for mobile screens */}
              <a 
                href="https://wa.me/917338757194"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex d-lg-none btn btn-success btn-sm align-items-center gap-1 py-1 px-2 rounded-3 text-white fw-bold"
                style={{ fontSize: '0.78rem' }}
                aria-label="WhatsApp Us"
              >
                <i className="bi bi-whatsapp"></i>
                <span className="d-none d-sm-inline">Chat</span>
              </a>

              {/* Mobile Menu Button */}
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="d-lg-none btn border py-2 px-3 rounded-3 d-flex align-items-center gap-2 fw-bold"
                style={{ 
                  background: mobileMenuOpen ? '#0b1e42' : '#ffffff', 
                  color: mobileMenuOpen ? '#ffffff' : '#0b1e42',
                  borderColor: '#cbd5e1' 
                }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                <i className={`bi ${mobileMenuOpen ? 'bi-x-lg text-white' : 'bi-list text-primary'} fs-5`}></i>
                <span className="fs-8 text-uppercase" style={{ letterSpacing: '0.04em' }}>
                  {mobileMenuOpen ? 'Close' : 'Menu'}
                </span>
              </motion.button>
            </div>
          </div>
        </motion.nav>
      </header>

      {/* Slide-in Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div style={{ position: 'relative', zIndex: 999999 }}>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-backdrop bg-dark bg-opacity-70"
              style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999998 }}
            />

            {/* Drawer Body - White Background */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="mobile-drawer-content bg-white shadow-2xl p-4 overflow-y-auto"
              style={{ 
                position: 'fixed', 
                top: 0, 
                right: 0, 
                width: '88%', 
                maxWidth: '400px', 
                height: '100vh', 
                zIndex: 999999,
                backgroundColor: '#ffffff',
                boxShadow: '-10px 0 35px rgba(0,0,0,0.35)'
              }}
            >
              {/* Drawer Header */}
              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
                <div className="d-flex align-items-center gap-2">
                  <img src={Logo} alt="Logo" style={{ height: '38px', width: 'auto' }} />
                  <div>
                    <span className="fw-bold fs-6 tamil-text d-block lh-1 brand-name-ta">பாரதி தேர்வுக்களம்</span>
                    <small className="text-warning fw-semibold" style={{ fontSize: '0.7rem' }}>Bharathi Academy · Erode</small>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-sm btn-light border rounded-circle p-1"
                  aria-label="Close Menu"
                >
                  <i className="bi bi-x fs-4"></i>
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="d-flex flex-column gap-2">
                <Link 
                  to="/" 
                  onClick={closeAllMenus} 
                  className={`nav-link-custom p-2 rounded-2 ${isActive('/') ? 'active' : ''}`}
                >
                  <i className="bi bi-house-door me-2 text-primary"></i>Home
                </Link>

                {/* TNPSC Accordion */}
                <div className="border rounded-3 p-2 bg-white shadow-sm" style={{ backgroundColor: '#ffffff' }}>
                  <button 
                    onClick={() => setMobileTnpscOpen(!mobileTnpscOpen)}
                    className="btn btn-sm w-100 d-flex justify-content-between align-items-center p-1 text-dark fw-bold"
                  >
                    <span className="d-flex align-items-center gap-2">
                      <i className="bi bi-book-half text-warning"></i>
                      <span>TNPSC Civil Services</span>
                    </span>
                    <i className={`bi bi-chevron-down fs-8 transition-all ${mobileTnpscOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  {mobileTnpscOpen && (
                    <div className="d-flex flex-column gap-1 pt-2 ps-3 border-top mt-1">
                      <Link to="/Group1" onClick={closeAllMenus} className="dropdown-item-custom">
                        <strong>Group I</strong> <span className="text-muted">(DC / DSP)</span>
                      </Link>
                      <Link to="/Group2" onClick={closeAllMenus} className="dropdown-item-custom">
                        <strong>Group II</strong> <span className="text-muted">(Sub-Registrar)</span>
                      </Link>
                      <Link to="/Group-2A" onClick={closeAllMenus} className="dropdown-item-custom">
                        <strong>Group II-A</strong> <span className="text-muted">(Secretariat)</span>
                      </Link>
                      <Link to="/Group4" onClick={closeAllMenus} className="dropdown-item-custom">
                        <strong>Group IV & VAO</strong> <span className="text-muted">(Village Officer)</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* TNUSRB Accordion */}
                <div className="border rounded-3 p-2 bg-white shadow-sm" style={{ backgroundColor: '#ffffff' }}>
                  <button 
                    onClick={() => setMobileTnusrbOpen(!mobileTnusrbOpen)}
                    className="btn btn-sm w-100 d-flex justify-content-between align-items-center p-1 text-dark fw-bold"
                  >
                    <span className="d-flex align-items-center gap-2">
                      <i className="bi bi-shield-shaded text-success"></i>
                      <span>TNUSRB Police Services</span>
                    </span>
                    <i className={`bi bi-chevron-down fs-8 transition-all ${mobileTnusrbOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  {mobileTnusrbOpen && (
                    <div className="d-flex flex-column gap-1 pt-2 ps-3 border-top mt-1">
                      <Link to="/Si-Recruitment" onClick={closeAllMenus} className="dropdown-item-custom">
                        <strong>SI Technical</strong> <span className="text-muted">(Wireless)</span>
                      </Link>
                      <Link to="/Si-FingerFrint" onClick={closeAllMenus} className="dropdown-item-custom">
                        <strong>SI Finger Print</strong> <span className="text-muted">(Forensic)</span>
                      </Link>
                      <Link to="/JointRecritment" onClick={closeAllMenus} className="dropdown-item-custom">
                        <strong>Joint SI</strong> <span className="text-muted">(Taluk/AR)</span>
                      </Link>
                      <Link to="/Common" onClick={closeAllMenus} className="dropdown-item-custom">
                        <strong>Common Police</strong> <span className="text-muted">(Constable)</span>
                      </Link>
                    </div>
                  )}
                </div>

                <Link to="/student-dashboard" onClick={closeAllMenus} className="nav-link-custom p-2 text-warning fw-bold">
                  <i className="bi bi-mortarboard-fill me-2 text-warning"></i>Student Dashboard & OMR
                </Link>

                <Link to="/Test-Series" onClick={closeAllMenus} className="nav-link-custom p-2">
                  <i className="bi bi-calendar3 me-2 text-warning"></i>2026 Test Schedules (PDF)
                </Link>

                <Link to="/Achivement" onClick={closeAllMenus} className="nav-link-custom p-2">
                  <i className="bi bi-trophy me-2 text-warning"></i>Results & Achievers (130+)
                </Link>

                <Link to="/About" onClick={closeAllMenus} className="nav-link-custom p-2">
                  <i className="bi bi-info-circle me-2 text-info"></i>About Us
                </Link>

                <Link to="/WhyAbout" onClick={closeAllMenus} className="nav-link-custom p-2">
                  <i className="bi bi-shield-check me-2 text-success"></i>Why Bharathi (Free Classes)
                </Link>

                <Link to="/Faculty" onClick={closeAllMenus} className="nav-link-custom p-2">
                  <i className="bi bi-people me-2 text-primary"></i>Faculty & Officer Mentors
                </Link>

                {/* Drawer Action CTAs */}
                <div className="border-top pt-3 mt-2 d-flex flex-column gap-2">
                  <Link to="/Student-Register" onClick={closeAllMenus} className="btn-gold-custom text-center py-2">
                    <i className="bi bi-pencil-square me-1"></i>Apply for Free Admission
                  </Link>
                  <Link to="/Student-Login" onClick={closeAllMenus} className="btn-primary-custom text-center py-2">
                    <i className="bi bi-mortarboard me-1"></i>Student Portal Login
                  </Link>
                  <div className="d-flex gap-2">
                    <Link to="/Staff-Login" onClick={closeAllMenus} className="btn-outline-custom flex-grow-1 text-center py-1 fs-8">
                      Staff Login
                    </Link>
                    <Link to="/Admin-Login" onClick={closeAllMenus} className="btn-outline-custom flex-grow-1 text-center py-1 fs-8">
                      Admin Login
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent App-Like Mobile Bottom Navigation Bar (< 992px) - Solid White Background */}
      <nav 
        className="mobile-bottom-nav d-lg-none bg-white border-top shadow-sm" 
        style={{ zIndex: 99998, backgroundColor: '#ffffff' }} 
        aria-label="Mobile Navigation"
      >
        <Link 
          to="/" 
          onClick={closeAllMenus} 
          className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}
        >
          <i className="bi bi-house-door-fill"></i>
          <span>Home</span>
        </Link>

        <Link 
          to="/Group4" 
          onClick={closeAllMenus} 
          className={`mobile-nav-item ${['/Group1', '/Group2', '/Group-2A', '/Group4'].includes(location.pathname) ? 'active' : ''}`}
        >
          <i className="bi bi-book-fill"></i>
          <span>TNPSC</span>
        </Link>

        <Link 
          to="/Test-Series" 
          onClick={closeAllMenus} 
          className={`mobile-nav-item ${isActive('/Test-Series') ? 'active' : ''}`}
        >
          <i className="bi bi-file-earmark-pdf-fill"></i>
          <span>Tests</span>
        </Link>

        <Link 
          to="/Achivement" 
          onClick={closeAllMenus} 
          className={`mobile-nav-item ${isActive('/Achivement') ? 'active' : ''}`}
        >
          <i className="bi bi-award-fill"></i>
          <span>Results</span>
        </Link>

        <button 
          type="button" 
          onClick={() => setMobileMenuOpen(true)} 
          className="mobile-nav-item border-0 bg-transparent"
        >
          <i className="bi bi-grid-fill text-warning"></i>
          <span className="fw-bold">Menu</span>
        </button>
      </nav>
    </>
  );
}