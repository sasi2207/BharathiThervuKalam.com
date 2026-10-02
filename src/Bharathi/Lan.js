import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { motion } from 'framer-motion';
import PageLoader from './Common/PageLoader';

// Public Components
import Header from './Header';
import Footer from './Fotters';
import Topnav from './topnav';
import Group1 from './Course/Group1';
import Group2 from './Course/Group2';
import Group4 from './Course/Group4';
import Group_2A from './Course/Group_2A';
import About from './About/About';
import WhyAbout from './About/WhyAbout';
import Faculty from './About/Faculty';
import TestSeries from './TestSeries';
import Achivement from './Achivement';
import Affairs from './Learn/Affairs';
import RazorpayPayment from './Payment/Payment';

// Police Courses
import RecruitmentPage from './Course/TNUSRB/SITechnical';
import Sifingerprint from './Course/TNUSRB/SIFingerPrint';
import JointRecruitmentDetails from './Course/TNUSRB/JoinRecruitment';
import Common from './Course/TNUSRB/Common';
import TnusrbStudent from '../StudentSyllabus/TNPSC/TNUSRB/TnusrbStudent';

// Auth & Users
import StudentRegisterForm from './Student/Student-Register';
import StudentLoginForm from './Student/Student-Login';
import StaffRegisterForm from './Staff/StaffRegister';
import StaffLoginForm from './Staff/StaffLogin';
import AdminRegistration from './Admin/Admin';
import AdminLogin from './Admin/AdminLogin';
import ForgotPassword from './Student/ForgetPassword';
import StaffForgotPassword from './Staff/StaffForgetPaswword';
import UserDetails from './Student/StudentDetails';

// Admin & Staff Management
import AdminNav from './Admin/add/AdminNav';
import AdminBottomNav from './Admin/add/AdminBottomNav';
import AdminFooter from './Admin/add/AdminFooter';
import Main from './Admin/add/Main';
import StaffDash from './Admin/add/StaffDash';
import StaffView from './Staff/StaffView';
import StaffFaculty from './Insert/POST/StaffFaculty';
import FacultyForm from './Insert/GET/Faculty';
import FacultyView from './Insert/POST/FacultyView';
import AchieversForm from './Insert/GET/Achivers';
import AchiversView from './Insert/POST/AchiversView';
import TestForm from './Insert/GET/Test';
import TestView from './Insert/POST/TestView';
import AdminOMRMaster from './Admin/OMR/AdminOMRMaster';
import StudentDashboard from './Student/StudentDashboard';
import StudentPortal from './Student/StudentPortal';
import GroupI from './Insert/GET/Group1';
import GroupIView from './Insert/POST/GroupIView';
import GroupII from './Insert/GET/Group2';
import GroupIIView from './Insert/POST/GroupIIView';
import GroupIIA from './Insert/GET/Group2A';
import GroupIIAView from './Insert/POST/GroupIIAView';
import GroupIV from './Insert/GET/Group4';
import GroupIVView from './Insert/POST/GroupIV-View';
import Tnusrb from './Insert/POST/Tnusrb';
import TnusrbForm from './Insert/GET/TnusrbFrom';
import SItechAdd from './TNUSRBAdd/SItech';
import CommonAdd from './TNUSRBAdd/Coomon';
import FingerPrintAdd from './TNUSRBAdd/FingerPrintAdd';
import CommonView from './TNUSRBView/CommonView';
import FingerPrintView from './TNUSRBView/FibgerPrintView';
import SITechnicalView from './TNUSRBView/SITechnivalView';

// Standard Layout Wrappers to prevent unkeyed array warnings
const PublicLayout = ({ children }) => (
  <div className="app-wrapper">
    <Header />
    <motion.main 
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="main-content"
    >
      {children}
    </motion.main>
    <Footer />
  </div>
);

const AdminLayout = ({ children }) => (
  <div className="app-wrapper">
    <AdminNav />
    <motion.main 
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="main-content"
    >
      {children}
    </motion.main>
    <AdminFooter />
    <AdminBottomNav />
  </div>
);

const StaffDashLayout = ({ children }) => (
  <div className="app-wrapper">
    <StaffDash />
    <motion.main 
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="main-content"
    >
      {children}
    </motion.main>
    <AdminFooter />
    <AdminBottomNav />
  </div>
);

function GoogleTranslate() {
  return (
    <div>
      <div id="google_translate_element"></div>
      
      <BrowserRouter>
        <PageLoader />
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<PublicLayout><Topnav /></PublicLayout>} />
          <Route path="/Group1" element={<PublicLayout><Group1 /></PublicLayout>} />
          <Route path="/Group2" element={<PublicLayout><Group2 /></PublicLayout>} />
          <Route path="/Group-2A" element={<PublicLayout><Group_2A /></PublicLayout>} />
          <Route path="/Group4" element={<PublicLayout><Group4 /></PublicLayout>} />
          <Route path="/Test-Series" element={<PublicLayout><TestSeries /></PublicLayout>} />
          <Route path="/About" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/WhyAbout" element={<PublicLayout><WhyAbout /></PublicLayout>} />
          <Route path="/Faculty" element={<PublicLayout><Faculty /></PublicLayout>} />
          <Route path="/Achivement" element={<PublicLayout><Achivement /></PublicLayout>} />
          
          {/* TNUSRB Police Programs */}
          <Route path="/TNUSRB" element={<PublicLayout><TnusrbStudent /></PublicLayout>} />
          <Route path="/Si-Recruitment" element={<PublicLayout><RecruitmentPage /></PublicLayout>} />
          <Route path="/Si-FingerFrint" element={<PublicLayout><Sifingerprint /></PublicLayout>} />
          <Route path="/JointRecritment" element={<PublicLayout><JointRecruitmentDetails /></PublicLayout>} />
          <Route path="/Common" element={<PublicLayout><Common /></PublicLayout>} />

          {/* Learning & Payments */}
          <Route path="/Affairs" element={<PublicLayout><Affairs /></PublicLayout>} />
          <Route path="/Payment" element={<RazorpayPayment />} />

          {/* User Authentication & Portals */}
          <Route path="/student-portal" element={<PublicLayout><StudentPortal /></PublicLayout>} />
          <Route path="/student-dashboard" element={<PublicLayout><StudentDashboard /></PublicLayout>} />
          <Route path="/Student-Register" element={<PublicLayout><StudentRegisterForm /></PublicLayout>} />
          <Route path="/Student-Login" element={<PublicLayout><StudentLoginForm /></PublicLayout>} />
          <Route path="/Staff-Register" element={<PublicLayout><StaffRegisterForm /></PublicLayout>} />
          <Route path="/Staff-Login" element={<PublicLayout><StaffLoginForm /></PublicLayout>} />
          <Route path="/Admin-Login" element={<PublicLayout><AdminLogin /></PublicLayout>} />
          <Route path="/Admin-Register" element={<PublicLayout><AdminRegistration /></PublicLayout>} />
          <Route path="/forgetpassword" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
          <Route path="/forget-staffpassword" element={<PublicLayout><StaffForgotPassword /></PublicLayout>} />

          {/* Staff & Admin Dashboards */}
          <Route path="/Adm" element={<AdminLayout><Main /></AdminLayout>} />
          <Route path="/StaffDash" element={<StaffDashLayout><Main /></StaffDashLayout>} />
          <Route path="/Student-Details" element={<AdminLayout><UserDetails /></AdminLayout>} />
          <Route path="/Student" element={<AdminLayout><StudentRegisterForm /></AdminLayout>} />
          <Route path="/Staff" element={<AdminLayout><StaffRegisterForm /></AdminLayout>} />
          <Route path="/Staff-View" element={<AdminLayout><StaffView /></AdminLayout>} />
          <Route path="/Faculty-Add" element={<AdminLayout><FacultyForm /></AdminLayout>} />
          <Route path="/Faculty-View" element={<AdminLayout><FacultyView /></AdminLayout>} />
          <Route path="/Achivers-Add" element={<AdminLayout><AchieversForm /></AdminLayout>} />
          <Route path="/Achivers-View" element={<AdminLayout><AchiversView /></AdminLayout>} />
          <Route path="/Test-Add" element={<AdminLayout><TestForm /></AdminLayout>} />
          <Route path="/Test-View" element={<AdminLayout><TestView /></AdminLayout>} />
          <Route path="/OMR-Master" element={<AdminLayout><AdminOMRMaster /></AdminLayout>} />
          <Route path="/admin/omr-keys" element={<AdminLayout><AdminOMRMaster /></AdminLayout>} />

          {/* TNPSC Admin */}
          <Route path="/Group-I-Add" element={<AdminLayout><GroupI /></AdminLayout>} />
          <Route path="/Group-I-View" element={<AdminLayout><GroupIView /></AdminLayout>} />
          <Route path="/Group2-Add" element={<AdminLayout><GroupII /></AdminLayout>} />
          <Route path="/Group2-View" element={<AdminLayout><GroupIIView /></AdminLayout>} />
          <Route path="/Group2A-Add" element={<AdminLayout><GroupIIA /></AdminLayout>} />
          <Route path="/Group2A-View" element={<AdminLayout><GroupIIAView /></AdminLayout>} />
          <Route path="/Group4-Add" element={<AdminLayout><GroupIV /></AdminLayout>} />
          <Route path="/Group4-View" element={<AdminLayout><GroupIVView /></AdminLayout>} />

          {/* TNUSRB Admin */}
          <Route path="/SI-Technical" element={<AdminLayout><SItechAdd /></AdminLayout>} />
          <Route path="/Tnusrb-Add" element={<AdminLayout><TnusrbForm /></AdminLayout>} />
          <Route path="/Tnusrb-View" element={<AdminLayout><Tnusrb /></AdminLayout>} />
          <Route path="/Common-Add" element={<AdminLayout><CommonAdd /></AdminLayout>} />
          <Route path="/Common-View" element={<AdminLayout><CommonView /></AdminLayout>} />
          <Route path="/FingerPrint-Add" element={<AdminLayout><FingerPrintAdd /></AdminLayout>} />
          <Route path="/FingerPrint-View" element={<AdminLayout><FingerPrintView /></AdminLayout>} />
          <Route path="/SITechnical-View" element={<AdminLayout><SITechnicalView /></AdminLayout>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default GoogleTranslate;
