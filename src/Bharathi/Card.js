import './Card.css';
import Logo from './img1/Logo.png';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Card() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="mycard">
      <div
        className="card custom-background shadow-lg"
        data-aos="fade-right"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine"
      >
        <img src={Logo} alt="TNPSC GROUP I" className="card-img" />
        <div className="card-content">
          <h3 className="card-title">TNPSC GROUP I</h3>
          <Link to={"/Group1"} className="card-link">Read More</Link>
        </div>
      </div>

      <div
        className="card custom-background shadow-lg"
        data-aos="fade-zoom-in"
        data-aos-easing="ease-in-back"
        data-aos-delay="300"
        data-aos-offset="0"
      >
        <img src={Logo} alt="Group-2A" className="card-img" />
        <div className="card-content">
          <h3 className="card-title">Group-2A</h3>
          <Link to={'/Group-2A'} className="card-link">Read More</Link>
        </div>
      </div>

      <div
        className="card custom-background shadow-lg"
        data-aos="fade-left"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine"
      >
        <img src={Logo} alt="TNPSC II & IIA" className="card-img" />
        <div className="card-content">
          <h3 className="card-title">TNPSC II & IIA</h3>
          <Link to={"/Group2"} className="card-link">Read More</Link>
        </div>
      </div>

      <div
        className="card custom-background shadow-lg"
        data-aos="fade-right"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine"
      >
        <img src={Logo} alt="TNPSC GROUP IV & VAO" className="card-img" />
        <div className="card-content">
          <h3 className="card-title">TNPSC GROUP IV & VAO</h3>
          <Link to={"/Group4"} className="card-link">Read More</Link>
        </div>
      </div>

      <div
        className="card custom-background shadow-lg"
        data-aos="fade-zoom-in"
        data-aos-easing="ease-in-back"
        data-aos-delay="300"
        data-aos-offset="0"
      >
        <img src={Logo} alt="TNUSRB SI / CONSTABLE" className="card-img" />
        <div className="card-content">
          <h3 className="card-title">TNUSRB SI / CONSTABLE</h3>
          <Link to={'/Si-Recruitment'} className="card-link">Read More</Link>
        </div>
      </div>

      <div
        className="card custom-background shadow-lg"
        data-aos="fade-left"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine"
      >
        <img src={Logo} alt="RRB" className="card-img" />
        <div className="card-content">
          <h3 className="card-title">RRB</h3>
          <Link to={'/'} className="card-link">Read More</Link>
        </div>
      </div>
    </div>
  );
}
