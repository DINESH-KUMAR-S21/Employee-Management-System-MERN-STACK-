import React from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';

const LeaveList = () => {
     const {user} = useAuth()
    const [leave, setLeave] = React.useState({
        userId: user?._id || ''
    })
    const [error, setError] = React.useState('')

    React.useEffect(() => {
      // Ensure userId is set once user is available
      setLeave(prev => ({ ...prev, userId: user?._id || prev.userId }))
    }, [user])

    const navigate = useNavigate();


    const handleChange = (e) => {
        const {name, value} = e.target;
        setLeave((prevState) => ({
            ...prevState,
            [name]: value
        }) );

    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      setError('')

      const payload = {
        userId: leave.userId || user?._id,
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        reason: leave.reason
      }

      if (!payload.userId) {
        setError('No employee selected')
        return
      }

      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(`${API_BASE_URL}/api/leave/add`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data && response.data.success) {
          // Redirect to employee dashboard after successful leave request
          navigate('/employee-dashboard')
        } else {
          setError(response.data?.message || 'Unexpected API response')
        }
      } catch (err) {
        console.error('Add leave error:', err, err.response?.data || err.message)
        setError(err.response?.data?.message || err.message || 'Failed to add leave')
      }
    }


    return (
         <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Request for Leave</h2>

      <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
            <select
              name="leaveType"
              onChange={handleChange}
             
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              required
            >
                     <option value="">Select Leave Type</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="annual">Annual Leave</option>
            </select>
          </div>

          {/* From Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="startDate"
                  placeholder="mm/dd/yyyy"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  required
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
               
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="endDate"
                  placeholder="mm/dd/yyyy"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  required
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                  
                </div>
              </div>
            </div>
          </div>

          {/* Designation */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="reason"
              placeholder="Reason"
              onChange={handleChange}
              className="w-full px-4 py-3 h-28 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              required
            ></textarea>
          </div>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-md"
          >
            Add Leave
          </button>
        </form>
      </div>

    )
}

export default LeaveList;