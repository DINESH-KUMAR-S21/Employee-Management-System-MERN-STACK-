import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCogs,
  FaRegCalendarAlt
} from 'react-icons/fa';
import { useAuth } from '../../context/authContext';

const Sidebar = () => {
  const { user } = useAuth()

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 mx-3 rounded-md transition-all
     ${
       isActive
         ? 'bg-teal-500 text-white border-l-4 border-teal-400'
         : 'text-gray-300 hover:bg-gray-700 hover:text-white'
     }`;

  return (
    <aside className="w-64 h-screen bg-slate-900 fixed left-0 top-0">
      
      {/* Header */}
     <div className="bg-teal-600 text-white h-16 flex items-center justify-center">
        <h3 className="text-2xl text-center font-pacific text-white">
          Employee MS
        </h3>
      </div>

      {/* Navigation */}
      <nav className="mt-4 space-y-1">

        <NavLink to="/employee-dashboard" className={navItemClass}end>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/employee-dashboard/profile" className={navItemClass}>
          <FaUsers />
          <span>My Profile</span>
        </NavLink>

          <NavLink to={`/employee-dashboard/leaves/${user?._id || user?.id || ''}`} className={navItemClass}>
          <FaCalendarAlt />
          <span>Leaves</span>
        </NavLink>

        <NavLink to={`/employee-dashboard/salary/${user?._id || user?.id || ''}`} className={navItemClass}>
         <FaMoneyBillWave />
          <span>Salary</span>
        </NavLink>"

        <NavLink to="/employee-dashboard/settings" className={navItemClass}>
          <FaCogs />
          <span>Settings</span>
        </NavLink>

         

      </nav>
    </aside>
  );
};

export default Sidebar;
