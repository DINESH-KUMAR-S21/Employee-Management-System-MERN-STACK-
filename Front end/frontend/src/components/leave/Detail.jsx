import axios from 'axios';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

const Detail = () => {
    const {id: paramId} = useParams();
    const { user } = useAuth();
    const id = paramId || user?._id || user?.id;
    const [leave, setLeave] = useState(null)
    const [error, setError] = useState(null)
    const Navigate = useNavigate();

    const getMaritalStatusLabel = (emp) => {
      const value = emp?.maritalStatus ?? emp?.martialStatus
      if (!value) return 'Not set'
      const mapping = { single: 'Single', married: 'Married', male: 'Male', female: 'Female', other: 'Other' }
      return mapping[value] || (value.charAt(0).toUpperCase() + value.slice(1))
    }

     useEffect(() => {
    const fetchLeave = async () => {

      if (!id) {
        setError('No employee selected')
        return
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/leave/detail/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
        })
        console.log('GET /api/employee/:id response:', response)

        if (response.data && response.data.success) {
            console.log('Leave object from API:', response.data.leave)
            setLeave(response.data.leave)
        } else {
            // If API returns an error shape or message
            setError(response.data?.message || 'Unexpected API response')
        }
      } catch (error) {
        console.error('Failed to fetch employee:', error, error.response?.data || error.message)
        setError(error.response?.data?.message || error.message || 'Failed to fetch employee')
      } 

    }
    
      fetchLeave()

  }, [id, user])

  const changeStatus = async (id, status) => {
      try {
        const response = await axios.put(`http://localhost:5000/api/leave/${id}`, { status },
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
        })
        console.log('PUT /api/leave/:id response:', response)

        if (response.data && response.data.success) {
            Navigate('/admin-dashboard/leaves');
            console.log('Leave object from API:', response.data.leave)
            setLeave(response.data.leave)
        } else {
            // If API returns an error shape or message
            setError(response.data?.message || 'Unexpected API response')
        }
      } catch (error) {
        console.error('Failed to update leave status:', error, error.response?.data || error.message)
        setError(error.response?.data?.message || error.message || 'Failed to update leave')
      } 
  }

  return (
    <>{leave ? (
  <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
    <h2 className="text-2xl font-bold mb-8 text-center">
      Leave Details
    </h2>

    <div className="mb-6 flex justify-center">
      <img
        src={leave?.employeeId?.userId?.profileImage ? `http://localhost:5000/uploads/${encodeURIComponent(leave.employeeId.userId.profileImage)}` : 'https://via.placeholder.com/150'}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover"
      />
    </div>

    <div>
      <div className="flex space-x-3 mb-5">
        <p className="text-lg font-bold">Name:</p>
        <p className="text-lg">{leave.employeeId?.userId?.name || 'N/A'}</p>
      </div>

      <div className="flex space-x-3 mb-5">
        <p className="text-lg font-bold">Employee ID:</p>
        <p className="text-lg">{leave.employeeId?.employeeId || 'N/A'}</p>
      </div>
      <div className="flex space-x-3 mb-5">
        <p className="text-lg font-bold">Leave Type:</p>
        <p className="font-medium">
          {leave.leaveType}
        </p>
      </div>

      <div className="flex space-x-3 mb-5">
        <p className="text-lg font-bold">Reason:</p>
        <p className="text-lg">{leave.reason}</p>
      </div>

      <div className="flex space-x-3 mb-5">
        <p className="text-lg font-bold">Department:</p>
        <p className="text-lg">{leave.employeeId?.department?.dep_name || 'N/A'}</p>
      </div>

      <div className="flex space-x-3 mb-5">
        <p className="text-lg font-bold">Start Date:</p>
        <p className="text-lg">{new Date(leave.startDate).toLocaleDateString()}</p>
      </div>

       <div className="flex space-x-3 mb-5">
        <p className="text-lg font-bold">End Date:</p>
        <p className="text-lg">{new Date(leave.endDate).toLocaleDateString()}</p>
      </div>

       <div className="flex space-x-3 mb-5">
        <p className="text-lg font-bold">
            {leave.status === "Pending" ? "Action:" : "Status:"}
            </p>
            {leave.status === "Pending" ? (
                <div className="flex space-x-2">
                    <button className="px-2 py-1 bg-green-600 text-white hover:bg-green-700 rounded"
                     onClick={() => changeStatus(leave._id, 'Approved')}>Approve</button>
                   
                    <button className="px-2 py-1 bg-red-600 text-white hover:bg-red-700 rounded"
                     onClick={() => changeStatus(leave._id, 'Rejected')}>Reject</button>
                </div>
            ):
             <p className="text-lg">{leave.status}</p>
        }
       
      </div>
    </div>
  </div>
  ) : (
    error ? <p className="text-red-600">{error}</p> : <p>Loading...</p>
  )}</>
);

}

export default Detail