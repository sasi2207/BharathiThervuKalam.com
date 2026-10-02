import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { motion } from 'framer-motion';
import PageLoader from './Common/PageLoader';

// Authentication & Security Guards
import { AuthProvider } from './Auth/AuthContext';
import ProtectedRoute from './Auth/ProtectedRoute';
import Login from './Auth/Login';

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

// Standard Layout Wrappers
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
    <AuthProvider>
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
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/Login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/student-portal" element={<PublicLayout><StudentPortal /></PublicLayout>} />
          <Route path="/Student-Register" element={<PublicLayout><StudentRegisterForm /></PublicLayout>} />
          <Route path="/Student-Login" element={<PublicLayout><StudentLoginForm /></PublicLayout>} />
          <Route path="/Staff-Register" element={<PublicLayout><StaffRegisterForm /></PublicLayout>} />
          <Route path="/Staff-Login" element={<PublicLayout><StaffLoginForm /></PublicLayout>} />
          <Route path="/Admin-Login" element={<PublicLayout><AdminLogin /></PublicLayout>} />
          <Route path="/Admin-Register" element={<PublicLayout><AdminRegistration /></PublicLayout>} />
          <Route path="/forgetpassword" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
          <Route path="/forget-staffpassword" element={<PublicLayout><StaffForgotPassword /></PublicLayout>} />

          {/* Protected Student Dashboard */}
          <Route 
            path="/student-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student', 'staff', 'admin']}>
                <PublicLayout><StudentDashboard /></PublicLayout>
              </ProtectedRoute>
            } 
          />

          {/* Protected Staff Workspace */}
          <Route 
            path="/StaffDash" 
            element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <StaffDashLayout><Main /></StaffDashLayout>
              </ProtectedRoute>
            } 
          />

          {/* Protected Admin Console & Management Routes */}
          <Route 
            path="/Adm" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout><Main /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Student-Details" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><UserDetails /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Student" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout><StudentRegisterForm /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Staff" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout><StaffRegisterForm /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Staff-View" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout><StaffView /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Faculty-Add" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><FacultyForm /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Faculty-View" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><FacultyView /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Achivers-Add" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><AchieversForm /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Achivers-View" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><AchiversView /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Test-Add" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><TestForm /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Test-View" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><TestView /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/OMR-Master" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><AdminOMRMaster /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/omr-keys" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><AdminOMRMaster /></AdminLayout>
              </ProtectedRoute>
            } 
          />

          {/* TNPSC Admin Routes */}
          <Route 
            path="/Group-I-Add" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout><GroupI /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Group-I-View" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><GroupIView /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Group2-Add" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout><GroupII /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Group2-View" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><GroupIIView /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Group2A-Add" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout><GroupIIA /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Group2A-View" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><GroupIIAView /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Group4-Add" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout><GroupIV /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Group4-View" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><GroupIVView /></AdminLayout>
              </ProtectedRoute>
            } 
          />

          {/* TNUSRB Admin Routes */}
          <Route 
            path="/SI-Technical" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout><SItechAdd /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Tnusrb-Add" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout><TnusrbForm /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Tnusrb-View" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><Tnusrb /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Common-Add" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout><CommonAdd /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Common-View" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><CommonView /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/FingerPrint-Add" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout><FingerPrintAdd /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/FingerPrint-View" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><FingerPrintView /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/SITechnical-View" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout><SITechnicalView /></AdminLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default GoogleTranslate;
