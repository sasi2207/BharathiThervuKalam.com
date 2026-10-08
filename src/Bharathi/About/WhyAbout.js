import React from 'react';
import { Link } from 'react-router-dom';

const WhyAbout = () => {
  const pillars = [
    {
      number: '01',
      title: 'Crossing Socio-Economic Barriers',
      description: 'Bharathi Academy was founded with the explicit mission to eliminate commercial hurdles and help aspiring students from underprivileged and rural backgrounds enter Government Service through Competitive Exams.'
    },
    {
      number: '02',
      title: 'Mentored by Serving Government Officers',
      description: 'Classes are conducted by officers currently serving in various Tamil Nadu Government departments. They volunteer their weekends purely with the intention to serve society and share their firsthand strategies with fellow students.'
    },
    {
      number: '03',
      title: '100% Free High-Quality Training',
      description: 'As Bharathi Academy is founded only with the aim of supporting aspiring candidates, foundational classes and mentorship are provided at zero cost. Complete guidance is provided across every stage of the syllabus.'
    },
    {
      number: '04',
      title: 'Intensive Batches for All Exams in Erode',
      description: 'Various specialized batches are conducted for TNPSC Group 1, Group 2, Group 2A, Group 4 & VAO, and TNUSRB Sub-Inspector & Police Constable exams at our dedicated study center in Erode.'
    },
    {
      number: '05',
      title: 'Nominal Test Paper Fee Only',
      description: 'No tuition fee is ever charged. A nominal fee is collected strictly to cover paper printing and automated OMR evaluation machine expenses for our weekly test batches.'
    }
  ];

  return (
    <div className="why-about-page">
      <section className="course-hero">
        <div className="site-container">
          <div className="d-flex align-items-center gap-2 text-warning small fw-bold text-uppercase mb-2">
            <Link to="/" className="text-warning text-decoration-none">Home</Link>
            <span>/</span>
            <Link to="/About" className="text-warning text-decoration-none">About</Link>
            <span>/</span>
            <span className="text-light">Why Bharathi</span>
          </div>

          <h1 className="text-white mb-2 fw-bold">Why Choose பாரதி தேர்வுக்களம்?</h1>
          <p className="text-light opacity-75 mb-0" style={{ maxWidth: '750px' }}>
            A mission-driven educational initiative founded on social justice, selfless officer mentorship, and proven competitive results.
          </p>
        </div>
      </section>

      <div className="site-container py-5">
        <div className="section-header text-center mx-auto mb-5" style={{ maxWidth: '700px' }}>
          <div className="section-kicker">Our Educational Philosophy</div>
          <h2 className="section-title">The Bharathi Commitment to Every Aspirant</h2>
          <p className="section-subtitle mx-auto">
            We believe that financial constraints should never stand between an earnest student and a career in public service.
          </p>
        </div>

        <div className="row g-4 mb-5">
          {pillars.map((pillar, idx) => (
            <div className="col-12 col-md-6 col-lg-4" key={idx}>
              <div className="academic-card h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="fs-3 fw-bold text-warning font-monospace">{pillar.number}</span>
                  <i className="bi bi-shield-check text-muted fs-5"></i>
                </div>
                <h5 className="mb-2 fw-bold">{pillar.title}</h5>
                <p className="small text-muted mb-0 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}

          {/* Call to action card */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="academic-card h-100 bg-dark text-white justify-content-center p-4">
              <div className="text-warning fs-1 mb-2">
                <i className="bi bi-mortarboard-fill"></i>
              </div>
              <h5 className="text-white mb-2 fw-bold">Ready to Begin Your Journey?</h5>
              <p className="small text-light opacity-75 mb-4">
                Join hundreds of successful candidates who transformed their aspirations into state service postings.
              </p>
              <Link to="/Student-Register" className="btn-gold-custom text-center">
                Register for 2026 Admissions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyAbout;
