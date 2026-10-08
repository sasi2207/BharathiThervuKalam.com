import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../OMR/OMRSheet.css';

const AdminBottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isCoursesActive = [
    '/Group-I-View',
    '/Group-I-Add',
    '/Group2-View',
    '/Group2-Add',
    '/Group2A-View',
    '/Group2A-Add',
    '/Group4-View',
    '/Group4-Add',
    '/Tnusrb-View',
    '/Tnusrb-Add',
    '/SI-Technical',
    '/SITechnical-View',
    '/FingerPrint-Add',
    '/FingerPrint-View',
    '/Common-Add',
    '/Common-View',
  ].includes(currentPath);

  const isTestsActive = ['/Test-Add', '/Test-View'].includes(currentPath);
  const isOMRActive = ['/OMR-Master', '/admin/omr-keys'].includes(currentPath);
  const isStudentsActive = ['/Student-Details', '/Student'].includes(currentPath);
  const isStaffActive = ['/Staff-View', '/Staff', '/Faculty-View', '/Faculty-Add'].includes(currentPath);

  return (
    <nav className="admin-bottom-nav" aria-label="Admin Navigation Bottom Bar">
      <div className="admin-bottom-nav-inner">
        {/* 1. Dashboard */}
        <Link
          to="/Adm"
          className={`admin-bottom-tab ${currentPath === '/Adm' || currentPath === '/StaffDash' ? 'active' : ''}`}
          title="Dashboard Overview"
        >
          <i className="bi bi-speedometer2 admin-bottom-icon"></i>
          <span>Dashboard</span>
        </Link>

        {/* 2. Courses */}
        <Link
          to="/Group-I-View"
          className={`admin-bottom-tab ${isCoursesActive ? 'active' : ''}`}
          title="Course Syllabi & Programs"
        >
          <i className="bi bi-book-half admin-bottom-icon"></i>
          <span>Courses</span>
        </Link>

        {/* 3. Tests & Papers */}
        <Link
          to="/Test-View"
          className={`admin-bottom-tab ${isTestsActive ? 'active' : ''}`}
          title="Question Papers & Test Series"
        >
          <i className="bi bi-file-earmark-text admin-bottom-icon"></i>
          <span>Tests</span>
        </Link>

        {/* 4. OMR Answer Keys & Validator (Dedicated!) */}
        <Link
          to="/OMR-Master"
          className={`admin-bottom-tab ${isOMRActive ? 'active' : ''}`}
          title="OMR Master Answer Keys & Evaluation"
        >
          <span className="admin-bottom-badge">OMR</span>
          <i className="bi bi-ui-checks-grid admin-bottom-icon"></i>
          <span>OMR Keys</span>
        </Link>

        {/* 5. Candidates */}
        <Link
          to="/Student-Details"
          className={`admin-bottom-tab ${isStudentsActive ? 'active' : ''}`}
          title="Registered Students"
        >
          <i className="bi bi-people-fill admin-bottom-icon"></i>
          <span>Students</span>
        </Link>

        {/* 6. Staff & Faculty */}
        <Link
          to="/Staff-View"
          className={`admin-bottom-tab ${isStaffActive ? 'active' : ''}`}
          title="Staff & Faculty Directory"
        >
          <i className="bi bi-person-badge admin-bottom-icon"></i>
          <span>Staff</span>
        </Link>
      </div>
    </nav>
  );
};

export default AdminBottomNav;
