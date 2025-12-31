import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { columns, LeaveButtons } from '../../utils/LeaveHelper';

const Table = () => {
   const [leaves, setLeaves] = useState([]);
   const [statusFilter, setStatusFilter] = useState('All');

   const displayedLeaves = leaves.filter((r) => {
     if (!r) return false
     if (statusFilter === 'All') return true
     return String(r.status || '').toLowerCase() === String(statusFilter).toLowerCase()
   })

    const fetchLeaves = async () => {
       
        try {
          const response = await axios.get('http://localhost:5000/api/leave', {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
  
          console.log(response.data)
          if (response.data && response.data.success) {
            let sno = 1
            const leavesArr = Array.isArray(response.data.leaves) ? response.data.leaves : []
            console.log('leavesArr', leavesArr)
            if (leavesArr.length > 0) console.log('first leave.employeeId', leavesArr[0].employeeId)

            const data = leavesArr.map((leave) => {
              const emp = leave.employeeId || {}

              const empIdVal = (typeof emp === 'object') ? (emp.employeeId || emp._id || 'N/A') : (emp || 'N/A')
              const name = emp.userId?.name || emp.name || 'N/A'
              const department = emp.department?.dep_name || emp.department?.name || 'N/A'

              const start = new Date(leave.startDate)
              const end = new Date(leave.endDate)
              const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))

              return {
                _id: leave._id,
                sno: sno++,
                employeeId: empIdVal,
                name,
                leaveType: leave.leaveType || 'N/A',
                department,
                days: diffDays,
                status: leave.status || 'Pending',
                action: <LeaveButtons ID={leave._id} />
              }
            })
            setLeaves(data)
          }
        } catch (error) {
          console.error('Failed to fetch leaves:', error)
        } 
    }
    useEffect(() => {
        fetchLeaves();
    }, []);
    return (
      <>
      {leaves ? (
        <div className ='p-6'> 
            <div className="text-center">
                            <h3 className="text-2xl font-bold">Manage Leaves</h3>
                        </div>
            
                        <div className="flex justify-between items-center">
                            <input
                                type="text"
                                placeholder="Search By Dep Name"
                                className="px-4 py-0.5 border"
                            />
                        <div className="space-x-2">
                          <button
                            className={`px-3 py-1 rounded ${statusFilter === 'All' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setStatusFilter('All')}
                          >All</button>
                          <button
                            className={`px-3 py-1 rounded ${statusFilter === 'Pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setStatusFilter('Pending')}
                          >Pending</button>
                          <button
                            className={`px-3 py-1 rounded ${statusFilter === 'Approved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setStatusFilter('Approved')}
                          >Approved</button>
                          <button
                            className={`px-3 py-1 rounded ${statusFilter === 'Rejected' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setStatusFilter('Rejected')}
                          >Rejected</button>
                        </div >
                    </div >
                    {displayedLeaves.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No records</div>
                    ) : (
                      <DataTable
                        columns={columns}
                        data={displayedLeaves}
                        pagination
                      />
                    )}
        </div>
        ) : <div>Loading leaves...</div>}
        </>
    )
}

export default Table;