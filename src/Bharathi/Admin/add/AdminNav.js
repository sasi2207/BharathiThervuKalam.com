import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { clearAuthToken } from '../../Api/Api';
import Logo from '../../img1/Logo.png';
import '../AdminDashboard.css';

const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    setMobileOpen(false);
    const result = await Swal.fire({
      title: 'Sign Out of Admin Console?',
      text: 'Your administrative session will be terminated securely.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Sign Out',
      cancelButtonText: 'Stay Signed In',
    });

    if (result.isConfirmed) {
      clearAuthToken();
      Swal.fire({
        title: 'Logged Out',
        text: 'Session ended successfully.',
        icon: 'success',
        timer: 1200,
        showConfirmButton: false,
      });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="admin-top-navbar">
        <div className="admin-nav-inner">
          {/* Brand */}
          <Link to="/Adm" className="admin-nav-brand">
            <img src={Logo} alt="Logo" style={{ height: '36px', width: 'auto' }} />
            <div className="d-flex flex-column">
              <span className="admin-nav-brand-title">பாரதி தேர்வுக்களம்</span>
              <span className="admin-nav-brand-badge">Admin Console</span>
            </div>
          </Link>

          {/* Desktop Navigation Menu */}
          <ul className="admin-menu-list">
            {/* Courses - Add Dropdown */}
            <li className="admin-nav-dropdown">
              <button
                type="button"
                className={`admin-nav-trigger ${
                  [
                    '/Tnusrb-Add',
                    '/SI-Technical',
                    '/FingerPrint-Add',
                    '/Common-Add',
                    '/Group-I-Add',
                    '/Group2-Add',
                    '/Group2A-Add',
                    '/Group4-Add',
                  ].includes(location.pathname)
                    ? 'active'
                    : ''
                }`}
              >
                <span>Courses-Add</span>
                <i className="bi bi-chevron-down chevron"></i>
              </button>
              <div className="admin-dropdown-popover">
                <div className="admin-dropdown-header">TNUSRB Uniformed Services</div>
                <Link
                  to="/Tnusrb-Add"
                  className={`admin-dropdown-link ${isActive('/Tnusrb-Add') ? 'active' : ''}`}
                >
                  Joint Recruitment (SIs & SO)
                </Link>
                <Link
                  to="/SI-Technical"
                  className={`admin-dropdown-link ${isActive('/SI-Technical') ? 'active' : ''}`}
                >
                  SI (Technical)
                </Link>
                <Link
                  to="/FingerPrint-Add"
                  className={`admin-dropdown-link ${isActive('/FingerPrint-Add') ? 'active' : ''}`}
                >
                  SI (Finger Print)
                </Link>
                <Link
                  to="/Common-Add"
                  className={`admin-dropdown-link ${isActive('/Common-Add') ? 'active' : ''}`}
                >
                  Common Recruitment
                </Link>

                <div className="admin-dropdown-divider"></div>
                <div className="admin-dropdown-header">TNPSC Civil Services</div>
                <Link
                  to="/Group-I-Add"
                  className={`admin-dropdown-link ${isActive('/Group-I-Add') ? 'active' : ''}`}
                >
                  Group I - Add
                </Link>
                <Link
                  to="/Group2-Add"
                  className={`admin-dropdown-link ${isActive('/Group2-Add') ? 'active' : ''}`}
                >
                  Group II - Add
                </Link>
                <Link
                  to="/Group2A-Add"
                  className={`admin-dropdown-link ${isActive('/Group2A-Add') ? 'active' : ''}`}
                >
                  Group II-A - Add
                </Link>
                <Link
                  to="/Group4-Add"
                  className={`admin-dropdown-link ${isActive('/Group4-Add') ? 'active' : ''}`}
                >
                  Group IV - Add
                </Link>
              </div>
            </li>

            {/* Courses - View Dropdown */}
            <li className="admin-nav-dropdown">
              <button
                type="button"
                className={`admin-nav-trigger ${
                  [
                    '/Group-I-View',
                    '/Group2-View',
                    '/Group2A-View',
                    '/Group4-View',
                    '/Tnusrb-View',
                    '/SITechnical-View',
                    '/FingerPrint-View',
                    '/Common-View',
                  ].includes(location.pathname)
                    ? 'active'
                    : ''
                }`}
              >
                <span>Courses-View</span>
                <i className="bi bi-chevron-down chevron"></i>
              </button>
              <div className="admin-dropdown-popover">
                <div className="admin-dropdown-header">TNPSC Civil Services</div>
                <Link
                  to="/Group-I-View"
                  className={`admin-dropdown-link ${isActive('/Group-I-View') ? 'active' : ''}`}
                >
                  Group I - View
                </Link>
                <Link
                  to="/Group2-View"
                  className={`admin-dropdown-link ${isActive('/Group2-View') ? 'active' : ''}`}
                >
                  Group II - View
                </Link>
                <Link
                  to="/Group2A-View"
                  className={`admin-dropdown-link ${isActive('/Group2A-View') ? 'active' : ''}`}
                >
                  Group II-A - View
                </Link>
                <Link
                  to="/Group4-View"
                  className={`admin-dropdown-link ${isActive('/Group4-View') ? 'active' : ''}`}
                >
                  Group IV - View
                </Link>

                <div className="admin-dropdown-divider"></div>
                <div className="admin-dropdown-header">TNUSRB Uniformed Services</div>
                <Link
                  to="/Tnusrb-View"
                  className={`admin-dropdown-link ${isActive('/Tnusrb-View') ? 'active' : ''}`}
                >
                  Joint Recruitment (SIs & SO) - View
                </Link>
                <Link
                  to="/SITechnical-View"
                  className={`admin-dropdown-link ${isActive('/SITechnical-View') ? 'active' : ''}`}
                >
                  SI (Technical) - View
                </Link>
                <Link
                  to="/FingerPrint-View"
                  className={`admin-dropdown-link ${isActive('/FingerPrint-View') ? 'active' : ''}`}
                >
                  SI (Finger Print) - View
                </Link>
                <Link
                  to="/Common-View"
                  className={`admin-dropdown-link ${isActive('/Common-View') ? 'active' : ''}`}
                >
                  Common Recruitment - View
                </Link>
              </div>
            </li>

            {/* Test Series */}
            <li className="admin-nav-dropdown">
              <button
                type="button"
                className={`admin-nav-trigger ${
                  ['/Test-Add', '/Test-View', '/OMR-Master'].includes(location.pathname) ? 'active' : ''
                }`}
              >
                <span>Test Series</span>
                <i className="bi bi-chevron-down chevron"></i>
              </button>
              <div className="admin-dropdown-popover">
                <Link
                  to="/Test-Add"
                  className={`admin-dropdown-link ${isActive('/Test-Add') ? 'active' : ''}`}
                >
                  Test Series - Add
                </Link>
                <Link
                  to="/Test-View"
                  className={`admin-dropdown-link ${isActive('/Test-View') ? 'active' : ''}`}
                >
                  Test Series - View
                </Link>
                <div className="admin-dropdown-divider"></div>
                <Link
                  to="/OMR-Master"
                  className={`admin-dropdown-link ${isActive('/OMR-Master') ? 'active' : ''}`}
                >
                  <i className="bi bi-ui-checks-grid text-warning me-1"></i> OMR Keys & Evaluator
                </Link>
              </div>
            </li>

            {/* Achievement */}
            <li className="admin-nav-dropdown">
              <button
                type="button"
                className={`admin-nav-trigger ${
                  ['/Achivers-Add', '/Achivers-View'].includes(location.pathname) ? 'active' : ''
                }`}
              >
                <span>Achievement</span>
                <i className="bi bi-chevron-down chevron"></i>
              </button>
              <div className="admin-dropdown-popover">
                <Link
                  to="/Achivers-Add"
                  className={`admin-dropdown-link ${isActive('/Achivers-Add') ? 'active' : ''}`}
                >
                  Achievement - Add
                </Link>
                <Link
                  to="/Achivers-View"
                  className={`admin-dropdown-link ${isActive('/Achivers-View') ? 'active' : ''}`}
                >
                  Achievement - View
                </Link>
              </div>
            </li>

            {/* Student */}
            <li className="admin-nav-dropdown">
              <button
                type="button"
                className={`admin-nav-trigger ${
                  ['/Student', '/Student-Details'].includes(location.pathname) ? 'active' : ''
                }`}
              >
                <span>Student</span>
                <i className="bi bi-chevron-down chevron"></i>
              </button>
              <div className="admin-dropdown-popover">
                <Link
                  to="/Student"
                  className={`admin-dropdown-link ${isActive('/Student') ? 'active' : ''}`}
                >
                  Student - Add
                </Link>
                <Link
                  to="/Student-Details"
                  className={`admin-dropdown-link ${isActive('/Student-Details') ? 'active' : ''}`}
                >
                  Student - View
                </Link>
              </div>
            </li>

            {/* Staff & Faculty */}
            <li className="admin-nav-dropdown">
              <button
                type="button"
                className={`admin-nav-trigger ${
                  ['/Staff', '/Staff-View', '/Faculty-View', '/Faculty-Add'].includes(location.pathname)
                    ? 'active'
                    : ''
                }`}
              >
                <span>Staff</span>
                <i className="bi bi-chevron-down chevron"></i>
              </button>
              <div className="admin-dropdown-popover">
                <Link
                  to="/Staff"
                  className={`admin-dropdown-link ${isActive('/Staff') ? 'active' : ''}`}
                >
                  Staff - Add
                </Link>
                <Link
                  to="/Staff-View"
                  className={`admin-dropdown-link ${isActive('/Staff-View') ? 'active' : ''}`}
                >
                  Staff - View
                </Link>
                <Link
                  to="/Faculty-View"
                  className={`admin-dropdown-link ${isActive('/Faculty-View') ? 'active' : ''}`}
                >
                  Faculty - View
                </Link>
              </div>
            </li>

            {/* Performance Audit */}
            <li>
              <Link
                to="/admin/crud-audit"
                className={`admin-nav-trigger ${isActive('/admin/crud-audit') ? 'active' : ''}`}
                style={{ textDecoration: 'none', color: '#0d9488' }}
              >
                <i className="bi bi-speedometer2 me-1"></i>
                <span>CRUD & Bulk Audit</span>
              </Link>
            </li>
          </ul>

          {/* Right Tools: View Site, Student Portal & LogOut */}
          <div className="admin-right-tools">
            <Link to="/student-dashboard" className="admin-view-site-btn d-none d-md-inline-flex" title="Open Student Portal">
              <i className="bi bi-mortarboard text-warning"></i>
              <span>Student Portal</span>
            </Link>

            <Link to="/" className="admin-view-site-btn d-none d-sm-inline-flex" title="Open Public Website">
              <i className="bi bi-box-arrow-up-right"></i>
              <span>View Site</span>
            </Link>

            <button type="button" onClick={handleLogout} className="admin-logout-btn">
              <i className="bi bi-box-arrow-right"></i>
              <span>LogOut</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Offcanvas Drawer */}
      {mobileOpen && (
        <div className="admin-drawer-backdrop" onClick={closeMobile}></div>
      )}

      <div className={`admin-mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="admin-drawer-header">
          <div className="d-flex align-items-center gap-2">
            <img src={Logo} alt="Logo" style={{ height: '30px' }} />
            <span className="fw-bold text-white small">Admin Navigation</span>
          </div>
          <button type="button" className="admin-drawer-close" onClick={closeMobile}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="admin-drawer-group">
          <div className="admin-drawer-group-title">TNUSRB Courses Add</div>
          <Link to="/Tnusrb-Add" onClick={closeMobile} className="admin-drawer-item">Joint Recruitment (SIs & SO)</Link>
          <Link to="/SI-Technical" onClick={closeMobile} className="admin-drawer-item">SI (Technical)</Link>
          <Link to="/FingerPrint-Add" onClick={closeMobile} className="admin-drawer-item">SI (Finger Print)</Link>
          <Link to="/Common-Add" onClick={closeMobile} className="admin-drawer-item">Common Recruitment</Link>
        </div>

        <div className="admin-drawer-group">
          <div className="admin-drawer-group-title">TNPSC Courses Add</div>
          <Link to="/Group-I-Add" onClick={closeMobile} className="admin-drawer-item">Group I - Add</Link>
          <Link to="/Group2-Add" onClick={closeMobile} className="admin-drawer-item">Group II - Add</Link>
          <Link to="/Group2A-Add" onClick={closeMobile} className="admin-drawer-item">Group II-A - Add</Link>
          <Link to="/Group4-Add" onClick={closeMobile} className="admin-drawer-item">Group IV - Add</Link>
        </div>

        <div className="admin-drawer-group">
          <div className="admin-drawer-group-title">Courses View</div>
          <Link to="/Group-I-View" onClick={closeMobile} className="admin-drawer-item">Group I - View</Link>
          <Link to="/Group2-View" onClick={closeMobile} className="admin-drawer-item">Group II - View</Link>
          <Link to="/Group2A-View" onClick={closeMobile} className="admin-drawer-item">Group II-A - View</Link>
          <Link to="/Group4-View" onClick={closeMobile} className="admin-drawer-item">Group IV - View</Link>
          <Link to="/Tnusrb-View" onClick={closeMobile} className="admin-drawer-item">Joint Recruitment (SIs & SO) - View</Link>
          <Link to="/SITechnical-View" onClick={closeMobile} className="admin-drawer-item">SI (Technical) - View</Link>
          <Link to="/FingerPrint-View" onClick={closeMobile} className="admin-drawer-item">SI (Finger Print) - View</Link>
          <Link to="/Common-View" onClick={closeMobile} className="admin-drawer-item">Common Recruitment - View</Link>
        </div>

        <div className="admin-drawer-group">
          <div className="admin-drawer-group-title">Test Series & OMR Keys</div>
          <Link to="/OMR-Master" onClick={closeMobile} className="admin-drawer-item text-warning fw-bold">
            <i className="bi bi-ui-checks-grid me-2"></i> OMR Keys & Evaluator
          </Link>
          <Link to="/Test-Add" onClick={closeMobile} className="admin-drawer-item">Test Series - Add</Link>
          <Link to="/Test-View" onClick={closeMobile} className="admin-drawer-item">Test Series - View</Link>
          <Link to="/student-dashboard" onClick={closeMobile} className="admin-drawer-item">
            <i className="bi bi-mortarboard me-2"></i> Student Dashboard & OMR
          </Link>
          <Link to="/Achivers-Add" onClick={closeMobile} className="admin-drawer-item">Achievement - Add</Link>
          <Link to="/Achivers-View" onClick={closeMobile} className="admin-drawer-item">Achievement - View</Link>
        </div>

        <div className="admin-drawer-group">
          <div className="admin-drawer-group-title">Candidates & Staff</div>
          <Link to="/Student" onClick={closeMobile} className="admin-drawer-item">Student - Add</Link>
          <Link to="/Student-Details" onClick={closeMobile} className="admin-drawer-item">Student - View</Link>
          <Link to="/Staff" onClick={closeMobile} className="admin-drawer-item">Staff - Add</Link>
          <Link to="/Staff-View" onClick={closeMobile} className="admin-drawer-item">Staff - View</Link>
          <Link to="/Faculty-View" onClick={closeMobile} className="admin-drawer-item">Faculty - View</Link>
        </div>

        <div className="pt-3 border-top border-secondary mt-3">
          <Link to="/" onClick={closeMobile} className="admin-drawer-item text-warning">
            <i className="bi bi-box-arrow-up-right me-2"></i> Visit Public Site
          </Link>
          <button type="button" onClick={handleLogout} className="btn btn-outline-danger w-100 mt-2 py-2 fw-bold">
            <i className="bi bi-box-arrow-right me-1"></i> LogOut
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminNav;
