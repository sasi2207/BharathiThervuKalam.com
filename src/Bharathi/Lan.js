
import Home from './Home';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Group1 from './Course/Group1';
import Group2 from './Course/Group2';
import Group4 from './Course/Group4';
import Footer from './Fotters';
import About from './About/About';
import WhyAbout from './About/WhyAbout';
import Topnav from './topnav';

import Faculty from './About/Faculty';





import Affairs from './Learn/Affairs';
import StaffRegisterForm from './Staff/StaffRegister';
import StaffLoginForm from './Staff/StaffLogin';
import StudentRegisterForm from './Student/Student-Register';
import StudentLoginForm from './Student/Student-Login';
import Header from './Header';
import UserDetails from './Student/StudentDetails';




import TnusrbForm from './Insert/GET/TnusrbFrom';
import TnusrbStudent from '../StudentSyllabus/TNPSC/TNUSRB/TnusrbStudent';
import FacultyForm from './Insert/GET/Faculty';
import FacultyView from './Insert/POST/FacultyView';
import GroupI from './Insert/GET/Group1';
import GroupIView from './Insert/POST/GroupIView';
import Tnusrb from './Insert/POST/Tnusrb';
import Group_2A from './Course/Group_2A';

import Achivers from './Insert/GET/Achivers';
import AchiversView from './Insert/POST/AchiversView';
import Achivement from './Achivement';
import StaffDash, { MainAdd } from './Admin/add/StaffDash';
import TestForm from './Insert/GET/Test';
import TestView from './Insert/POST/TestView';
import TestSeries from './TestSeries';
import AdminRegistration from './Admin/Admin';
import AdminLogin from './Admin/AdminLogin';
import RecruitmentPage from './Course/TNUSRB/SITechnical';

import RazorpayPayment from './Payment/Payment';
import Sifingerprint from './Course/TNUSRB/SIFingerPrint';
import GroupII from './Insert/GET/Group2';
import GroupIIView from './Insert/POST/GroupIIView';
import GroupIIA from './Insert/GET/Group2A';
import GroupIIAView from './Insert/POST/GroupIIAView';
import GroupIV from './Insert/GET/Group4';
import GroupIVView from './Insert/POST/GroupIV-View';
import JointRecruitmentDetails from './Course/TNUSRB/JoinRecruitment';

import Common from './Course/TNUSRB/Common';
import ForgotPassword from './Student/ForgetPassword';
import ResetPassword from './Student/ResetPassword';
import StaffForgotPassword from './Staff/StaffForgetPaswword';
import AchieversForm from './Insert/GET/Achivers';
import StaffView from './Staff/StaffView';
import Main from './Admin/add/Main';
import AdminNav from './Admin/add/AdminNav';
import CommonAdd from './TNUSRBAdd/Coomon';
import FingerPrintAdd from './TNUSRBAdd/FingerPrintAdd';
import StaffFaculty from './Insert/POST/StaffFaculty';
import SItechAdd from './TNUSRBAdd/SItech';
import CommonView from './TNUSRBView/CommonView';
import FingerPrintView from './TNUSRBView/FibgerPrintView';
import SITechnicalView from './TNUSRBView/SITechnivalView';
import StudentHome from './Admin/add/StudentNav';








function GoogleTranslate() {
 
  

  return (
    <div>
           
    <div id="google_translate_element" >

       
    </div>
   
      {/* First Router */}

    <BrowserRouter>
   
     
     
    <Routes >
        
        <Route path='/' element={ [<Header/>,<Home/>,<Topnav></Topnav>,<Footer/>]}></Route>
        <Route path='Group1' element={[<Header/>,<Home/>,<Group1></Group1>,<Footer/>]}></Route>
        
        <Route path='Group2' element={[<Header/>,<Home/>,<Group2></Group2>,<Footer/>]}></Route>
        
        <Route path='Group4' element={[<Header/>,<Home/>,<Group4></Group4>,<Footer/>]}></Route>
        
        <Route path='SI-Technical' element={[<AdminNav/>,<SItechAdd/>,<Footer/>]}></Route>
        
        
        <Route path='Group-2A' element={[<Header/>,<Home/>,<Group_2A/>,<Footer/>]}></Route>
      <Route path='Test-Series' element={[<Header/>,<StudentHome/>,<TestSeries/>,<Footer/>]}></Route>

        {/* About Details */}

        <Route path='About' element={[<Header/>,<Home/>,<About></About>,<Footer/>]}></Route>
        <Route path='WhyAbout' element={[<Header/>,<Home/>,<WhyAbout></WhyAbout>,<Footer/>]}></Route>
       
        <Route path='Faculty' element={[<Header/>,<Home/>,<StaffFaculty/>,<Footer/>]}></Route>



     <Route path='Payment' element={[<RazorpayPayment/>]}></Route>


        {/* TNPSC Details */}

      
        <Route path='TNUSRB' element={[<Header/>,<Home/>,<TnusrbStudent/>,<Footer/>]}></Route>
          
       

       
        

        <Route path="Si-Recruitment" element={[<Header/>,<Home/>,<RecruitmentPage/>,<Footer/>]}></Route>

        <Route path="Si-FingerFrint" element={[<Header/>,<Home/>,<Sifingerprint/>,<Footer/>]}></Route>

        <Route path="JointRecritment" element={[<Header/>,<Home/>,<JointRecruitmentDetails/>,<Footer/>]}></Route>

        <Route path="Common" element={[<Header/>,<Home/>,<Common/>,<Footer/>]}></Route>

        {/* Learning Center */}


          <Route path='Affairs' element={[<Header/>,<Home/>,<Affairs></Affairs>,<Footer/>]}></Route>

          <Route path='Admin-Login' element={[<Header/>,<Home/>,<AdminLogin/>,<Footer/>]}></Route>
          <Route path='Adm'  element={[<AdminNav/>,<Main/>,<Footer/>]}></Route>
          {/* <Route path='Adm'  element={[<MyDash/>]}></Route> */}
          <Route path="Admin-Register" element={[<Header/>,<Home/>,<AdminRegistration/>,<Footer/>]}></Route>


          {/* Staff */}

          <Route path='Staff-Register' element={[<Header/>,<Home/>,<StaffRegisterForm/>,<Footer/>]}></Route>
          <Route path='Staff-Login' element={[<Header/>,<Home/>,<StaffLoginForm/>,<Footer/>]}></Route>
          {/* <Route path='forgot-password' element={[<Header/>,<Home/>,<StaffForgotPassword/>,<Footer/>]}></Route> */}
          <Route path='Faculty-View' element={[<AdminNav/>,<StaffFaculty/>,<Footer/>]}></Route>
          

          {/* Student */}

          <Route path='Student-Register' element={[<Header/>,<Home/>,<StudentRegisterForm/>,<Footer/>]}></Route>
          <Route path='Student-Login' element={[<Header/>,<Home/>,<StudentLoginForm></StudentLoginForm>,<Footer/>]}></Route>

          <Route path='Student-Details' element={[<AdminNav/>,<UserDetails></UserDetails>,<Footer/>]}></Route>


          <Route path="/forgetpassword" element={[<Header/>,<Home/>,<ForgotPassword/>,<Footer/>]} />
        <Route path="/forget-staffpassword" element={[<Header/>,<Home/>,<StaffForgotPassword/>,<Footer/>]} />
               

               {/* Admin */}
       
          <Route path='Student' element={[<AdminNav/>,<StudentRegisterForm></StudentRegisterForm>,<Footer/>]}></Route>
          <Route path='Staff' element={[<AdminNav/>,<StaffRegisterForm/>,<Footer/>]}></Route>
          <Route path='Staff-View' element={[<AdminNav/>,<StaffView/>,<Footer/>]}></Route>
          <Route path='Faculty-Add' element={[<AdminNav/>,<FacultyForm/>,<Footer/>]}></Route>
          {/* <Route path='Achive-Add' element={[<AdminDash~/>,<AchieversForm/>]}></Route> */}
         
            <Route path='Tnusrb-View' element={[<AdminNav/>,<Tnusrb/>,<Footer/>]}></Route>
          <Route path='Tnusrb-Add' element={[<AdminNav/>,<TnusrbForm/>,<Footer/>]}></Route>
          <Route path='Faculty-View' element={[<AdminNav/>,<FacultyView/>,<Footer/>]}></Route>
          <Route path='Group-I-Add'element={[<AdminNav/>,<GroupI/>,<Footer/>]} ></Route>
          <Route path='Group-I-View'element={[<AdminNav/>,<GroupIView/>,<Footer/>]}></Route>

          <Route path='Achivers-Add' element={[<AdminNav/>,<AchieversForm/>,<Footer/>]}></Route>

          <Route path='Achivers-View'element={[<AdminNav/>,<AchiversView/>,<Footer/>]}></Route>

          <Route path='Achivement'element= {[<Header/>,<Home/>,<Achivement/>,<Footer/>]}></Route>
           

           <Route path='StaffDash' element={[<StaffDash/>,<Main/>,<Footer/>]}></Route>

           <Route path='Test-Add' element={[<AdminNav/>,<TestForm/>,<Footer/>]}></Route>
           <Route path='Test-View' element={[<AdminNav/>,<TestView/>,<Footer/>]}></Route>


           <Route path='Group2-Add' element={[<AdminNav/>,<GroupII/>,<Footer/>]}></Route>
           <Route path='Group2-View' element={[<AdminNav/>,<GroupIIView/>,<Footer/>]}></Route>


           <Route path='Group2A-Add' element={[<AdminNav/>,<GroupIIA/>,<Footer/>]}></Route>
           <Route path='Group2A-View' element={[<AdminNav/>,<GroupIIAView/>,<Footer/>]}></Route>


           <Route path='Group4-Add' element={[<AdminNav/>,<GroupIV/>,<Footer/>]}></Route>
           <Route path='Group4-View' element={[<AdminNav/>,<GroupIVView/>,<Footer/>]}></Route>



          <Route path='Common-Add' element={[<AdminNav/>,<CommonAdd/>,<Footer/>]}></Route>
          <Route path='FingerPrint-Add' element={[<AdminNav/>,<FingerPrintAdd/>,<Footer/>]}></Route>

          <Route path='Common-View' element={[<AdminNav/>,<CommonView/>,<Footer/>]}></Route>

          <Route path='FingerPrint-View' element={[<AdminNav/>,<FingerPrintView/>,<Footer/>]}></Route>

          <Route path='SITechnical-View' element={[<AdminNav/>,<SITechnicalView/>,<Footer/>]}></Route>
          
    </Routes>
  

    
    </BrowserRouter>



       
    </div>
  );
}

export default GoogleTranslate;
