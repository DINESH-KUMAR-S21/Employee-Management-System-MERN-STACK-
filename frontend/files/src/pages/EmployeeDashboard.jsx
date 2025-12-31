import React from 'react';
import Sidebar from '../components/EmployeeDashboard/Sidebar';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const EmployeeDashboard = () => {
    return (
                
            <div className='flex'>
           <Sidebar/>
           <div className='flex-1 ml-64 bg-gray-100 min-h-screen'>
            <Navbar/>
            <div className="p-6">
              <Outlet />
            </div>
           </div >
        </div>
        
    );
}
export default EmployeeDashboard;