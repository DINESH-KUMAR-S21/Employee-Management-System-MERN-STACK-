import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {AttendanceHelper, columns} from '../../utils/AttendanceHelper'
import DataTable from 'react-data-table-component'
import { StyleSheetManager } from 'styled-components'
import API_BASE_URL from '../../config/api'

const forwardedFilter = (prop) => {
  const blocked = [
    'dense', 'headCell', 'isDragging', 'sortActive', 'sortDirection', 'renderAsCell',
    'striped', 'highlightOnHover', 'pointerOnHover', 'responsive', 'fixedHeader', 'fixedHeaderScrollHeight']

  return !blocked.includes(prop)
}

const Attendance = () => {
   const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(false)
  const [filteredAttendance, setFilteredAttendance] = useState(null)

  const statusChange = () => {
    fetchAttendance()
  }

  const fetchAttendance = async () => {
          setLoading(true)
        try {
          const response = await axios.get(`${API_BASE_URL}/api/attendance`, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
  
          console.log(response.data)
          if (response.data && response.data.success) {
            let sno = 1
            const data = response.data.attendance.map((att) => ({
              employeeId: att.employeeId.employeeId,
              sno: sno++,
              department: att.employeeId.department.dep_name,
              name: att.employeeId.userId.name, 
              action: <AttendanceHelper status={att.status} employeeId={att.employeeId.employeeId} statusChange={statusChange} />
            }))
            setAttendance(data)
            setFilteredAttendance(data)
         
          }
        } catch (error) {
          console.error('Failed to fetch departments:', error)
        } finally {
          setLoading(false)
        }
      } 
  
  useEffect(() => {
      
  
      fetchAttendance()
    }, []) 
   const handleFilter = (e) => {
  const value = e.target.value.toLowerCase()

  const records = attendance.filter((emp) =>
    (emp.name && emp.name.toLowerCase().includes(value))
  )

  setFilteredAttendance(records)
}

if(!filteredAttendance){
    return <div>Loading...</div>
}


  return (
    <div className = 'text-center'>
        <div className="p-5">
          
            <h3 className='text-2xl font-bold'> Manage Attendance</h3>
          </div>
    
          <div className='flex justify-between items-center mb-4'>
            <input
              type="text"
              placeholder="search by Employee name"
              onChange={handleFilter}
              className="px-4 py-1 border border-gray-300 rounded bg-gray-200 text-black placeholder-gray-600"
            //   onChange={filterDepartments}
            />
            <p>
                Mark Employees for {new Date().toISOString().split('T')[0]}{" "}
            </p>
            <Link to="/admin-dashboard/attendance-report" className='px-4 py-1 bg-teal-600 rounded text-white'>Attendance Report</Link>
          </div>
          <div>
            <StyleSheetManager shouldForwardProp={forwardedFilter}>
              <DataTable columns={columns} data={filteredAttendance} />
            </StyleSheetManager>
          </div>
          </div>
  )
}

export default Attendance