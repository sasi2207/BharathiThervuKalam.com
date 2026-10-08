import React from 'react';



const SideMenu = () => {
    return (
        <div className="side-menu">
            <div className="brand-name">
                <h1>Brand</h1>
            </div>
            <ul>
                <li>&nbsp; <span>Dashboard</span> </li>
                <li>&nbsp;<span>Students</span> </li>
                <li>&nbsp;<span>Teachers</span> </li>
                <li>&nbsp;<span>Schools</span> </li>
                <li>&nbsp;<span>Income</span> </li>
                <li>&nbsp; <span>Help</span></li>
                <li>&nbsp;<span>Settings</span> </li>
            </ul>
        </div>
    );
}

export default SideMenu;
