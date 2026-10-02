import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './img1/Logo.png';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="site-footer">
        <div className="site-container">
          <div className="row g-4 justify-content-between">
            {/* Col 1: Brand & Mission */}
            <div className="col-12 col-md-4 col-lg-4" data-aos="fade-up" data-aos-delay="100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <img src={Logo} alt="பாரதி தேர்வுக்களம்" style={{ height: '46px', width: 'auto' }} />
                <div>
                  <h5 className="text-white mb-0 fs-6 fw-bold tamil-text">பாரதி தேர்வுக்களம்</h5>
                  <small className="text-warning text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>
                    Bharathi Academy · Erode
                  </small>
                </div>
              </div>
              <p className="text-secondary small mb-3" style={{ lineHeight: '1.6' }}>
                Brainchild of dedicated civil service officers founded on 12.08.2017 in Erode. Dedicated to providing 100% free classroom guidance and mentorship to empower aspirants from all socio-economic backgrounds into Tamil Nadu Government Service.
              </p>
              <div className="d-flex align-items-center gap-2 text-warning fw-semibold tamil-text small">
                <i className="bi bi-award-fill"></i>
                <span>"வெற்றியின் முதல் படி !" — Over 130+ Selections</span>
              </div>
            </div>

            {/* Col 2: TNPSC Programs */}
            <div className="col-6 col-md-2 col-lg-2" data-aos="fade-up" data-aos-delay="200">
              <h6 className="footer-heading">TNPSC Exams</h6>
              <ul className="footer-links">
                <li><Link to="/Group1" onClick={scrollToTop}>Group I (DC / DSP)</Link></li>
                <li><Link to="/Group2" onClick={scrollToTop}>Group II (Interview)</Link></li>
                <li><Link to="/Group-2A" onClick={scrollToTop}>Group II-A (Non-Int.)</Link></li>
                <li><Link to="/Group4" onClick={scrollToTop}>Group IV & VAO</Link></li>
                <li><Link to="/Test-Series" onClick={scrollToTop}>Test Series 2026</Link></li>
              </ul>
            </div>

            {/* Col 3: TNUSRB Police Programs */}
            <div className="col-6 col-md-3 col-lg-3" data-aos="fade-up" data-aos-delay="300">
              <h6 className="footer-heading">TNUSRB Police</h6>
              <ul className="footer-links">
                <li><Link to="/Si-Recruitment" onClick={scrollToTop}>SI (Technical)</Link></li>
                <li><Link to="/Si-FingerFrint" onClick={scrollToTop}>SI (Finger Print)</Link></li>
                <li><Link to="/JointRecritment" onClick={scrollToTop}>Joint Recruitment (SI/SO)</Link></li>
                <li><Link to="/Common" onClick={scrollToTop}>Common Police Batch</Link></li>
                <li><Link to="/Achivement" onClick={scrollToTop}>Hall of Fame & Results</Link></li>
              </ul>
            </div>

            {/* Col 4: Contact & Academy Center */}
            <div className="col-12 col-md-3 col-lg-3" data-aos="fade-up" data-aos-delay="400">
              <h6 className="footer-heading">Academy Office</h6>
              <ul className="footer-links">
                <li className="d-flex align-items-start gap-2 text-secondary small">
                  <i className="bi bi-geo-alt-fill text-warning mt-1"></i>
                  <span>Bharathi Academy, Erode, Tamil Nadu - 638001</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-whatsapp text-success"></i>
                  <a href="https://wa.me/917338757194" target="_blank" rel="noopener noreferrer">+91 7338757194</a>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-telephone text-info"></i>
                  <a href="tel:+918012194136">+91 8012194136</a>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-envelope text-warning"></i>
                  <a href="mailto:thervukalam@gmail.com">thervukalam@gmail.com</a>
                </li>
              </ul>

              <div className="mt-3">
                <Link to="/Student-Register" onClick={scrollToTop} className="btn-gold-custom w-100 text-center py-2 fs-8">
                  Admissions Open 2026
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div className="footer-bottom d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="small text-secondary">
              © {new Date().getFullYear()} பாரதி தேர்வுக்களம் (Bharathi Thervukalam). All rights reserved.
            </div>
            <div className="d-flex align-items-center gap-3 small">
              <Link to="/About" onClick={scrollToTop} className="text-secondary text-decoration-none">About Us</Link>
              <span className="text-secondary opacity-25">·</span>
              <Link to="/Faculty" onClick={scrollToTop} className="text-secondary text-decoration-none">Mentors & Officers</Link>
              <span className="text-secondary opacity-25">·</span>
              <Link to="/Student-Login" onClick={scrollToTop} className="text-secondary text-decoration-none">Student Portal</Link>
              <span className="text-secondary opacity-25">·</span>
              <button onClick={scrollToTop} className="btn btn-sm btn-link text-warning text-decoration-none p-0">
                Back to top ↑
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Quick Action Button */}
      <a 
        href="https://wa.me/917338757194?text=Hello%20Bharathi%20Academy%2C%20I%20would%20like%20to%20know%20more%20about%20the%20courses%20and%20test%20series."
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp-btn"
        title="Chat with Bharathi Academy on WhatsApp"
        aria-label="WhatsApp Contact"
      >
        <i className="bi bi-whatsapp"></i>
      </a>
    </>
  );
}
