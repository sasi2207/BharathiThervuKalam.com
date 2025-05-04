import './fotters.css'; 
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="footer">
      <div className="contact-section1">
        <div className="row11">
          <div className="text-center  bg-primary-custom">
            <h6>Get In Touch</h6>
            <div className="line11"></div>
            <ul className="text-start">
              <li><i className="bi bi-geo-alt"></i>Erode</li>
              <li><i className="bi bi-envelope"></i><a className="nav-link d-inline" href="mailto:thervukalam@gmail">Thervukalam@gmail.com</a></li>
              <li><i className="bi bi-whatsapp"></i><a className="nav-link d-inline" href="tel:+91 7338757194">+91 7338757194</a></li>
              <li><i className="bi bi-whatsapp"></i><a className="nav-link d-inline" href="tel:+91 8012194136">+91 8012194136</a></li>
              
              <li><i className="bi bi-telephone"></i><a className="nav-link d-inline" href="tel:+91 9791388577">+91 9791388577</a></li>
            </ul>
          </div>

          <div className="text-center  bg-primary-custom">
            <h6>TNPSC</h6>
            <div className="line11"></div>
            <ul className="text-start mt-5">
              <li><Link to={'/Group1'} className='nav-link' onClick={scrollToTop}><i className="bi bi-arrow-right"></i>Group-I</Link></li>
              <li><Link to={'/Group2'} className='nav-link' onClick={scrollToTop}><i className="bi bi-arrow-right"></i>Group-II</Link></li>
              <li><Link to={'/Group-2A'} className='nav-link' onClick={scrollToTop}><i className="bi bi-arrow-right"></i>Group-II-A</Link></li>
              <li><Link to={'/Group4'} className='nav-link' onClick={scrollToTop}><i className="bi bi-arrow-right"></i>Group-IV&VOA</Link></li>
            </ul>
          </div>

          <div className="text-center  bg-primary-custom">
            <h6>TNUSRB</h6>
            <div className="line11"></div>
            <ul className="text-start mt-5">
              <li><Link to={'/JointRecritment'} className='nav-link' onClick={scrollToTop}><i className="bi bi-arrow-right"></i>Joint Recruitment (SIs & SO)</Link></li>
              <li><Link to={'/Si-Recruitment'} className='nav-link' onClick={scrollToTop}><i className="bi bi-arrow-right"></i>SI (Technical)</Link></li>
              <li><Link to={'/Si-FingerFrint'} className='nav-link' onClick={scrollToTop}><i className="bi bi-arrow-right"></i>SI (Finger Print)</Link></li>
              <li><Link to={'/Common'} className='nav-link' onClick={scrollToTop}><i className="bi bi-arrow-right"></i>Common Recruitment</Link></li>
            </ul>
          </div>

          <div className="text-center  bg-primary-custom">
            <h6>Quick Links</h6>
            <div className="line11"></div>
            <ul className="text-start mt-5">
              <li><Link to={'/'} className='nav-link' onClick={scrollToTop}><i className="bi bi-arrow-right"></i>Home</Link></li>
              <li><Link to={'/About'} className='nav-link' onClick={scrollToTop}><i className="bi bi-arrow-right"></i>About</Link></li>
              <li><Link to={'/Achivement'} className='nav-link' onClick={scrollToTop}><i className="bi bi-arrow-right"></i>Achievement</Link></li>
              <li><Link to={'/Faculty'} className='nav-link' onClick={scrollToTop}><i className="bi bi-arrow-right"></i>Faculty</Link></li>
            </ul>
          </div>


          <div className="text-center  bg-primary-custom">
            <h6>Login</h6>
            <div className="line11"></div>
            <ul className="text-start mt-5">
              <li><Link to={'/Admin-Login'} className='nav-link' onClick={scrollToTop}><i className="bi bi-arrow-right"></i>Admin Login</Link></li>
              <li><Link to={'/Staff-Login'} className='nav-link' onClick={scrollToTop}><i className="bi bi-arrow-right"></i>Staff Login</Link></li>
              <li><Link to={'/Student-Login'} className='nav-link' onClick={scrollToTop}><i className="bi bi-arrow-right"></i>Student Login</Link></li>
            
            </ul>
          </div>
          <div className='container '>
        <hr></hr>
        <h3 className='text-center text-light'>Copyright © 2024, The BharathiThervuKalam . All rights reserved Developed by SasiKumar  <a href="tel:/7448788879" className="hnum ps-1">+91 7448788879</a></h3>
      </div>

        </div>
        
      </div>
     
    </div>
  );
}
