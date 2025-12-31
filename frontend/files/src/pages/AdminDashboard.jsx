import React from 'react';
import { useAuth } from '../context/authContext';
import AdminSidebar from '../components/dashboard/AdminSidebar';
import Navbar from '../components/Navbar';
import AdminSummary from '../components/AdminSummary';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
    const {user, loading} = useAuth();
   
    return (
        <div className='flex'>
           <AdminSidebar/>
           <div className='flex-1 ml-64 bg-gray-100 min-h-screen'>
            <Navbar/>
            <div className="p-6">
              <Outlet />
            </div>
           </div >
        </div>
    )
}

export default AdminDashboard;