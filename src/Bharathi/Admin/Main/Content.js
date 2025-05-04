import React from 'react';
import Cards from './Cards';
import RecentPayments from './StaffDetails';
import NewStudents from './NewStudent';
import './Over.css'

const Content = () => {
    return (
        <div className="content">
             <Cards/>
            <div className="content-2">
               <RecentPayments/>
               <NewStudents/>
            </div>
        </div>
    );
}

export default Content;
