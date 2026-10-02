import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../img1/Logo.png';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Banner */}
      <section className="course-hero">
        <div className="site-container">
          <div className="d-flex align-items-center gap-2 text-warning small fw-bold text-uppercase mb-2">
            <Link to="/" className="text-warning text-decoration-none">Home</Link>
            <span>/</span>
            <span className="text-light">About Us</span>
          </div>

          <h1 className="text-white mb-2 fw-bold">About பாரதி தேர்வுக்களம் (Bharathi Academy)</h1>
          <p className="text-light opacity-75 mb-0" style={{ maxWidth: '750px' }}>
            Empowering aspiring youth from across Tamil Nadu through selfless service, expert civil service mentorship, and 100% free quality education.
          </p>
        </div>
      </section>

      {/* Main Story & Content */}
      <div className="site-container py-5">
        <div className="row g-5 align-items-center mb-5">
          <div className="col-12 col-lg-7">
            <div className="section-kicker">Our Foundation Story</div>
            <h2 className="section-title mb-3">Serving the Society Through Knowledge Since 2017</h2>
            
            <p className="text-muted leading-relaxed">
              <strong>Bharathi Academy</strong> was the brainchild of a passionate team of youngsters preparing for competitive exams with the primary motive of entering Government Service. The academy was kick-started on <strong>12.08.2017</strong> in Erode, Tamil Nadu.
            </p>
            <p className="text-muted leading-relaxed">
              Over the last seven years, the academy has successfully produced <strong>more than 130+ candidates</strong> who are now placed as Deputy Collectors, Sub-Inspectors of Police, Sub-Registrars, Municipal Commissioners, and Village Administrative Officers in various Government Departments across Tamil Nadu.
            </p>
            <p className="text-muted leading-relaxed mb-4">
              The fundamental motto of the Academy is <em>"வெற்றியின் முதல் படி !" (First Step to Success)</em> — to impart a transformative, positive change in society by guiding honest, dedicated candidates from economically modest backgrounds into civil administration.
            </p>

            <div className="d-flex flex-wrap gap-3">
              <Link to="/Faculty" className="btn-primary-custom">
                <span>Meet Our Officer Mentors</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
              <Link to="/Achivement" className="btn-outline-custom">
                <span>View Hall of Fame</span>
              </Link>
            </div>
          </div>

          <div className="col-12 col-lg-5 text-center">
            <div className="academic-card p-5 bg-white shadow-lg text-center">
              <img 
                src={Logo} 
                alt="பாரதி தேர்வுக்களம்" 
                className="img-fluid mb-4 mx-auto"
                style={{ maxHeight: '160px' }}
              />
              <h4 className="fw-bold mb-1 tamil-text">பாரதி தேர்வுக்களம்</h4>
              <p className="text-warning small text-uppercase fw-semibold mb-3">Erode, Tamil Nadu</p>
              
              <div className="border-top pt-3 text-start small text-muted">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-calendar-event text-warning"></i>
                  <span><strong>Established:</strong> 12th August 2017</span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-award-fill text-warning"></i>
                  <span><strong>Total Selections:</strong> 130+ Appointed Officers</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-geo-alt-fill text-warning"></i>
                  <span><strong>Campus:</strong> Erode, Tamil Nadu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Principles Bento Grid */}
        <div className="section-header text-center mx-auto mb-4" style={{ maxWidth: '650px' }}>
          <div className="section-kicker">Core Values</div>
          <h2 className="section-title">The Principles Behind Our Academy</h2>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-12 col-md-4">
            <div className="academic-card h-100">
              <div className="text-warning fs-3 mb-2">
                <i className="bi bi-heart-fill"></i>
              </div>
              <h5 className="mb-2">100% Free Classroom Teaching</h5>
              <p className="small text-muted mb-0">
                Tuition is completely free for all students. We eliminate commercial fee barriers to ensure that every deserving aspirant has equal access to quality guidance.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="academic-card h-100">
              <div className="text-warning fs-3 mb-2">
                <i className="bi bi-briefcase-fill"></i>
              </div>
              <h5 className="mb-2">Mentored by Serving Officers</h5>
              <p className="small text-muted mb-0">
                Classes and strategy sessions are directly conducted by officers working in Government departments who share real-world administrative experience.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="academic-card h-100">
              <div className="text-warning fs-3 mb-2">
                <i className="bi bi-clipboard2-data-fill"></i>
              </div>
              <h5 className="mb-2">Statewide OMR Test Rigor</h5>
              <p className="small text-muted mb-0">
                Weekly Saturday and Sunday offline test batches replicate real exam environments with quick results, rankings, and subject-wise post-test discussions.
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Inquiry Strip */}
        <div className="academic-card p-4 bg-light border-0">
          <div className="row align-items-center g-3">
            <div className="col-12 col-md-8">
              <h5 className="mb-1 fw-bold">Have questions or want to visit the Erode center?</h5>
              <p className="small text-muted mb-0">Our coordinators are ready to help you with batch timings, test series, and study materials.</p>
            </div>
            <div className="col-12 col-md-4 text-md-end">
              <a href="https://wa.me/917338757194" target="_blank" rel="noopener noreferrer" className="btn-gold-custom">
                <i className="bi bi-whatsapp"></i>
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
