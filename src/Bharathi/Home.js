import React, { useEffect } from 'react';
import './home.css'; // Ensure this path is correct and file exists
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    // search-box open close js code
    const navbar = document.querySelector(".navbar");
    const searchBox = document.querySelector(".search-box .bx-search");
    
    const handleSearchBoxClick = () => {
      navbar.classList.toggle("showInput");
      if (navbar.classList.contains("showInput")) {
        searchBox.classList.replace("bx-search", "bx-x");
      } else {
        searchBox.classList.replace("bx-x", "bx-search");
      }
    };

    if (searchBox) {
      searchBox.addEventListener("click", handleSearchBoxClick);
    }

    // sidebar open close js code
    const navLinks = document.querySelector(".nav-links");
    const menuOpenBtn = document.querySelector(".navbar .bx-menu");
    const menuCloseBtn = document.querySelector(".nav-links .bx-x");
    
    if (menuOpenBtn) {
      menuOpenBtn.onclick = () => {
        navLinks.style.left = "0";
      };
    }
    
    if (menuCloseBtn) {
      menuCloseBtn.onclick = () => {
        navLinks.style.left = "-100%";
      };
    }

    // sidebar submenu open close js code
    const htmlcssArrow = document.querySelector(".htmlcss-arrow");
    const moreArrow = document.querySelector(".more-arrow");
    const jsArrow = document.querySelector(".js-arrow");
    const jArrow = document.querySelector(".j-arrow");
    const viewArrow = document.querySelector(".view-arrow");
    
    if (htmlcssArrow) {
      htmlcssArrow.onclick = () => {
        navLinks.classList.toggle("show1");
      };
    }

    if (moreArrow) {
      moreArrow.onclick = () => {
        navLinks.classList.toggle("show2");
      };
    }

    if (jsArrow) {
      jsArrow.onclick = () => {
        navLinks.classList.toggle("show3");
      };
    }

    if (jArrow) {
      jArrow.onclick = () => {
        navLinks.classList.toggle("show4");
      };
    }

    if (viewArrow) {
      viewArrow.onclick = () => {
        navLinks.classList.toggle("show5");
      };
    }

    // Cleanup event listeners on unmount
    return () => {
      if (searchBox) {
        searchBox.removeEventListener("click", handleSearchBoxClick);
      }
    };
  }, []); 

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const closeMenu = () => {
    const navLinks = document.querySelector(".nav-links");
    navLinks.style.left = "-100%";
  };

  return (
    <nav className='sticky-top'>
      <div className="navbar">
        <i className='bx bx-menu'></i>
        <div className="logo ">
          <Link to="/" onClick={scrollToTop}>
            பாரதி தேர்வுக்களம் 
          </Link>
        </div>
        <div className="nav-links scroll-menu">
          <div className="sidebar-logo">
            <span className="logo-name">பாரதி தேர்வுக்களம்</span>
            <i className='bx bx-x'></i>
          </div>
          <ul className="links">
            <li><Link to={'/'} onClick={() => { scrollToTop(); closeMenu(); }}>HOME</Link></li>
            <li>
              <Link to="#" onClick={closeMenu}>Courses</Link>
              <i className='bx bxs-chevron-down htmlcss-arrow arrow'></i>
              <ul className="htmlCss-sub-menu sub-menu">
                <li className="more">
                  <span><Link to="#" >TNUSRB<i className='bx bxs-chevron-right arrow more-arrow'></i></Link></span>
                  <ul className="more-sub-menu sub-menu">
                    <li><Link to={'/JointRecritment'} onClick={() => { scrollToTop(); closeMenu(); }}>Joint Recruitment (SIs & SO)</Link></li>
                    <li><Link to={'/Si-Recruitment'} onClick={() => { scrollToTop(); closeMenu(); }}>SI (Technical)</Link></li>
                    <li><Link to={'/Si-FingerFrint'} onClick={() => { scrollToTop(); closeMenu(); }}>SI (Finger Print)</Link></li>
                    <li><Link to={'/Common'} onClick={() => { scrollToTop(); closeMenu(); }}>Common Recruitment</Link></li>
                  </ul>
                </li>
                <li className="more">
                  <span><Link to="#" >TNPSC<i className='bx bxs-chevron-right arrow view-arrow'></i></Link></span>
                  <ul className="view-sub-menu sub-menu">
                    <li><Link to={'/Group1'} onClick={() => { scrollToTop(); closeMenu(); }}>Group I</Link></li>
                    <li><Link to={'/Group2'} onClick={() => { scrollToTop(); closeMenu(); }}>Group II</Link></li>
                    <li><Link to={'/Group-2A'} onClick={() => { scrollToTop(); closeMenu(); }}>Group II-A</Link></li>
                    <li><Link to={'/Group4'} onClick={() => { scrollToTop(); closeMenu(); }}>Group IV</Link></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <Link to="#" onClick={closeMenu}>About</Link>
              <i className='bx bxs-chevron-down js-arrow arrow'></i>
              <ul className="js-sub-menu sub-menu">
                <li><Link to={'/About'} onClick={() => { scrollToTop(); closeMenu(); }}>About Bharathi</Link></li>
                <li><Link to={'/WhyAbout'} onClick={() => { scrollToTop(); closeMenu(); }}>Why Bharathi</Link></li>
                <li><Link to={'/Faculty'} onClick={() => { scrollToTop(); closeMenu(); }}>Faculty</Link></li>
              </ul>
            </li>
            <li><Link to="/Achivement" onClick={closeMenu}>Achievement</Link></li>
            <li><Link to={"/Student-Login"} onClick={closeMenu}>Test Series</Link></li>
            <li><Link to={'/Student-Register'} onClick={() => { scrollToTop(); closeMenu();   }}>Student | Register</Link></li>
            <li>
              <Link to="#" onClick={closeMenu}>LogIn</Link>
              <i className='bx bxs-chevron-down j-arrow arrow'></i>
              <ul className="j-sub-menu sub-menu">
                <li><Link to={'/Admin-Login'} onClick={() => { scrollToTop(); closeMenu(); }}>Admin Login</Link></li>
                <li><Link to={'/Staff-Login'} onClick={() => { scrollToTop(); closeMenu();  }}>Staff Login</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Home;
