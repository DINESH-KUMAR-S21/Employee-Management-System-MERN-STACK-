import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import API_BASE_URL from '../../config/api';

const Setting = () => {

    const navigate = useNavigate()
    const {user} = useAuth();
    const [setting, setSetting] = useState({
        userId: user._id,
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSetting(prev => ({ ...prev, [name]: value }));
        // Clear any previous error when the user edits inputs
        if (error) setError("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic validation
        if (!setting.oldPassword || !setting.newPassword || !setting.confirmPassword) {
            setError('All password fields are required');
            return;
        }
        if (setting.newPassword !== setting.confirmPassword) {
            setError('New password and confirm password do not match');
            return;
        }

        try{
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE_URL}/api/auth/change-password`, {
                oldPassword: setting.oldPassword,
                newPassword: setting.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data);
            alert(response.data?.message || 'Password changed successfully');
            // clear fields on success
            setSetting({ userId: setting.userId, oldPassword: '', newPassword: '', confirmPassword: '' });

            // Navigate based on current user's role to avoid unauthorized redirects
            const role = user?.role || ''
            if (role.toLowerCase() === 'admin') {
              navigate('/admin-dashboard')
            } else {
              navigate('/employee-dashboard')
            }
        }catch(err){
            console.error("Error changing password:", err?.response?.data || err.message || err);
            setError(err?.response?.data?.message || 'Error changing password');
        }
    }
    return (
         <div className="max-w-3xl mx-auto mt-20 bg-white p-8 rounded-md shadow-md w-130 h-110">
      <h3 className="text-2xl font-semibold mb-8">Change Password</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="oldPassword" className="text-sm font-medium text-gray-700 mb-3">
           Old Password
          </label>
          <input
            id="oldPassword"
            name="oldPassword"
            type="password"
            onChange={handleChange}
            placeholder="Old Password"
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 mb-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3" htmlFor="newPassword">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="New Password"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 mb-3"
          />
        </div>

           <div>
          <label className="block text-sm font-medium mb-3" htmlFor="confirmPassword">
           Confirm Password
          </label>
          <input
          type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 mb-3"
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        </div>

        <button className="bg-teal-600 text-white px-4 py-3 rounded w-full">
          Change Password
        </button>
      </form>
    </div>
    )
}

export default Setting;