import React, { useEffect } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

const StudentHome = () => {

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
           
         

      
           
           
          
           
           
           
        

            <li><Link  onClick={handleLogout}>LogOut</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default StudentHome;
