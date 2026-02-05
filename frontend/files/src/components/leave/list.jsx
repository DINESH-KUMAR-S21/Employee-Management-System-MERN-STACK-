import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

const LeaveList = () => {
    const [leaves, setLeaves] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    let sno = 1
    const {id} = useParams()

   const fetchLeaves = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(
        `${API_BASE_URL}/api/leave/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (response.data && response.data.success) {
        const data = Array.isArray(response.data.leaves) ? response.data.leaves : []
        setLeaves(data)
      } else {
        console.warn('GET /api/leave/:id returned non-success:', response)
        setLeaves([])
      }
    } catch (error) {
      console.error('Failed to fetch leaves:', error, error.response?.data || error.message)
      setError(error.response?.data?.message || error.message || 'Failed to fetch leaves')
      setLeaves([])
     } finally {
       setLoading(false)
     }
  }
  useEffect(() => {
    if (!id || id === 'undefined') return
    fetchLeaves()
  }, [id])

    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-red-600">Error: {error}</div>

    return (
        <div className ='p-6'>
            <div className="text-center">
                <h3 className="text-2xl font-bold">Manage Leaves</h3>
            </div>
            {leaves.length === 0 && (
              <div className="text-center py-8 text-gray-500">No records</div>
            )}

            <div className="flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search By Dep Name"
                    className="px-4 py-0.5 border"
                />

                <Link
                    to="/employee-dashboard/leaves/add-leave"
                    className="px-4 py-1 bg-teal-600 rounded text-white">

                        Add New Leave
                </Link>
            </div >
               <table className="w-full text-sm text-left text-gray-500 mt-4">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th className="px-6 py-3">SNO</th>
                <th className="px-6 py-3">Leave Type</th>
                <th className="px-6 py-3">From</th>
                <th className="px-6 py-3">To</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {(leaves || []).map((leave) => (
                <tr
                  key={leave._id}
                  className="bg-white border-b"
                >
                  <td className="px-6 py-3">{sno++}</td>
                  <td className="px-6 py-3">{leave.leaveType}</td>
                    <td className="px-6 py-3">
                        {new Date(leave.startDate).toLocaleDateString()}
                        </td>
                  <td className="px-6 py-3">
                        {new Date(leave.endDate).toLocaleDateString()}
                        </td>       

                            <td className="px-6 py-3">
                        {leave.reason}
                        </td>   

                         <td className="px-6 py-3">
                        {leave.status}
                        </td>       
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    );
};

export default LeaveList;