import React from 'react';
import { Link } from 'react-router-dom';
import './Side.css';
import logo from './Logo.png';
import Home from '../../Home';

export const MainAdd = () => {
  const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  };

  return (

    <div>

      
    <div id="main" className=" pl-5">
      <span 
        onClick={openNav} 
        className="togg">&#9776;
      </span>

   
    </div>

    </div>
  );
};

const AdminDash = () => {
  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
  };

  return (
    <div>
      <div id="mySidenav" className="sidenav">
        <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
        <Link to="/Adm">Dashboard</Link>
        <Link to="/">Home</Link>
        <Link to="/Staff">Staff Add</Link>
        <Link to="/Student">Student Add</Link>
        <Link to="/Faculty-Add">Faculty Add</Link>
        <Link to="/Achivers-Add">Achievers Add</Link>
        <Link to="/Group-I">Add Group I</Link>
        <Link to="/Group2-Add">Add Group II</Link>
        <Link to="/Group2A-Add">Add Group II-A</Link>
        <Link to="/Group4-Add">Add Group IV</Link>
        <Link to="/TNUSRB-Add">TNUSRB Syllabus Add</Link>
        <Link to="/Test-Add">Test Series Add</Link>
        <Link to="/Staff-View">View Staff</Link>
        <Link to="/Student-Details">View Student</Link>
        <Link to="/Faculty-View">View Faculty</Link>
        <Link to="/Group-I-View">Group I View</Link>
        <Link to="/Group2-View">Group II View</Link>
        <Link to="/Group2A-View">Group II-A View</Link>
        <Link to="/Group4-View">Group IV View</Link>
        <Link to="/Tnusrb-View">TNUSRB Syllabus View</Link>
        <Link to="/Achivers-View">View Achievers</Link>
        <Link to="/Test-View">View Test Series</Link>
      </div>
    </div>
  );
};

export default AdminDash;




