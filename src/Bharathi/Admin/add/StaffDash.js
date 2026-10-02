import React, { useEffect } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Home = () => {

  const navicate=useNavigate();
  useEffect(() => {
    // Search box toggle
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
    
    // Sidebar menu toggle
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

    // Sidebar submenu toggle
    const toggleSubMenu = (selector, className) => {
      const arrow = document.querySelector(selector);
      if (arrow) {
        arrow.onclick = () => {
          navLinks.classList.toggle(className);
        };
      }
    };

    toggleSubMenu(".htmlcss-arrow", "show1");
    toggleSubMenu(".more-arrow", "show2");
    toggleSubMenu(".js-arrow", "show3");
    toggleSubMenu(".j-arrow", "show4");
    toggleSubMenu(".view-arrow", "show5");
    toggleSubMenu(".test-series-arrow", "show6");
    toggleSubMenu(".achievement-arrow", "show7");
    toggleSubMenu(".student-register-arrow", "show8");

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

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      // Show a loading effect
      Swal.fire({
        title: 'Logging out...',
        text: 'Please wait a moment.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Simulate a network request or any async operation
      setTimeout(() => {
        // Redirect or handle logout logic here
        // Example: window.location.href = '/login'; // Redirect to login page
        Swal.close();
        console.log('Logged out successfully'); // Replace with actual logout logic
        navicate("/")
      }, 2000); // Simulated delay for demonstration
    }
  };

  return (
    <nav className='sticky-top'>
      <div className="navbar">
        <i className='bx bx-menu'></i>
        <div className="logo">
          <Link to="/" onClick={scrollToTop}>
            பாரதி தேர்வுக் களம் 
          </Link>
        </div>
        <div className="nav-links">
          <div className="sidebar-logo">
            <span className="logo-name">பாரதி தேர்வுக் களம்</span>
            <i className='bx bx-x'></i>
          </div>
          <ul className="links">
            {/* <li><Link to={'/'} onClick={() => { scrollToTop(); closeMenu(); }}>HOME</Link></li> */}
            <li>
              <Link to="#" onClick={closeMenu}>Courses - Add</Link>
              <i className='bx bxs-chevron-down htmlcss-arrow arrow'></i>
              <ul className="htmlCss-sub-menu sub-menu">
                <li className="more">
                  <span><Link to="#" >TNUSRB<i className='bx bxs-chevron-right arrow more-arrow'></i></Link></span>
                  <ul className="more-sub-menu sub-menu">
                  <li><Link to={'/'} onClick={() => { scrollToTop(); closeMenu(); }}>Joint Recruitment (SIs & SO)</Link></li>
                    <li><Link to={'/SI-Technical'} onClick={() => { scrollToTop(); closeMenu(); }}>SI (Technical)</Link></li>
                    <li><Link to={'/FingerPrint-Add'} onClick={() => { scrollToTop(); closeMenu(); }}>SI (Finger Print)</Link></li>
                    <li><Link to={'/Common-Add'} onClick={() => { scrollToTop(); closeMenu(); }}>Common Recruitment</Link></li>
                  </ul>
                </li>
                <li className="more">
                  <span><Link to="#" >TNPSC<i className='bx bxs-chevron-right arrow view-arrow'></i></Link></span>
                  <ul className="view-sub-menu sub-menu">
                    <li><Link to={'/Group-I-Add'} onClick={() => { scrollToTop(); closeMenu(); }}>Group I - Add</Link></li>
                    <li><Link to={'/Group2-Add'} onClick={() => { scrollToTop(); closeMenu(); }}>Group II - Add</Link></li>
                    <li><Link to={'/Group2A-Add'} onClick={() => { scrollToTop(); closeMenu(); }}>Group II-A -Add</Link></li>
                    <li><Link to={'/Group4-Add'} onClick={() => { scrollToTop(); closeMenu(); }}>Group IV -Add</Link></li>
                  </ul>
                </li>
              </ul>
            </li>

      
            <li>
              <Link to="#" onClick={closeMenu}>Courses -View</Link>
              <i className='bx bxs-chevron-down js-arrow arrow'></i>
              <ul className="js-sub-menu sub-menu">
              <li><Link to={'/Group-I-View'} onClick={() => { scrollToTop(); closeMenu(); }}>Group I - View</Link></li>
                    <li><Link to={'/Group2-View'} onClick={() => { scrollToTop(); closeMenu(); }}>Group II - View</Link></li>
                    <li><Link to={'/Group2A-View'} onClick={() => { scrollToTop(); closeMenu(); }}>Group II-A - View</Link></li>
                    <li><Link to={'/Group4-View'} onClick={() => { scrollToTop(); closeMenu(); }}>Group IV - View</Link></li>
                <li><Link to={'/'} onClick={() => { scrollToTop(); closeMenu(); }}>Joint Recruitment (SIs & SO)-View</Link></li>
                <li><Link to={'/SITechnical-View'} onClick={() => { scrollToTop(); closeMenu(); }}>SI (Technical)-View</Link></li>
                <li><Link to={'/FingerPrint-View'} onClick={() => { scrollToTop(); closeMenu(); }}>SI (Finger Print)-View</Link></li>
                <li><Link to={'/Common-View'} onClick={() => { scrollToTop(); closeMenu(); }}>Common Recruitment-View</Link></li>
             
              </ul>
            </li>
            <li>
              <Link to="#" onClick={closeMenu}>Test Series</Link>
              <i className='bx bxs-chevron-down test-series-arrow arrow'></i>
              <ul className="test-series-sub-menu sub-menu">
                {/* Add dropdown items for Test Series here */}
                <li><Link to={'/Test-Add'} onClick={() => { scrollToTop(); closeMenu(); }}>Test Series-Add</Link></li>
                <li><Link to={'/Test-View'} onClick={() => { scrollToTop(); closeMenu(); }}>Test Series-View</Link></li>
              </ul>
            </li>
            <li>
              <Link to="#" onClick={closeMenu}>Achievement</Link>
              <i className='bx bxs-chevron-down achievement-arrow arrow'></i>
              <ul className="achievement-sub-menu sub-menu">
                {/* Add dropdown items for Achievement here */}
                <li><Link to={'/Achivers-Add'} onClick={() => { scrollToTop(); closeMenu(); }}>Achievement-Add</Link></li>
                <li><Link to={'/Achivers-View'} onClick={() => { scrollToTop(); closeMenu(); }}>Achievement-View</Link></li>
              </ul>
            </li>
            <li>
              <Link to="#" onClick={closeMenu}>Student</Link>
              <i className='bx bxs-chevron-down student-register-arrow arrow'></i>
              <ul className="student-register-sub-menu sub-menu">
                {/* Add dropdown items for Student | Register here */}
                <li><Link to={'/Student'} onClick={() => { scrollToTop(); closeMenu(); }}>Student-Add</Link></li>
                <li><Link to={'/Student-Details'} onClick={() => { scrollToTop(); closeMenu(); }}>Student-view</Link></li>
              </ul>
            </li>
           
        

            <li><Link  onClick={handleLogout}>LogOut</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Home;
