import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { EmployeeButtons, columns } from '../../utils/EmployeeHelper'
import DataTable from 'react-data-table-component'
import { StyleSheetManager } from 'styled-components'
import API_BASE_URL from '../../config/api'

const forwardedFilter = (prop) => {
  const blocked = [
    'dense', 'headCell', 'isDragging', 'sortActive', 'sortDirection', 'renderAsCell',
    'striped', 'highlightOnHover', 'pointerOnHover', 'responsive', 'fixedHeader', 'fixedHeaderScrollHeight']

  return !blocked.includes(prop)
}

const List = () => {
   const [empLoading, setEmpLoading] = useState(false)
  const [employees, setEmployees] = useState([])
  const [filterdEmployees, setFilteredEmployees] = useState([])

   useEffect(() => {
      const fetchEmployees = async () => {
          setEmpLoading(true)
        try {
          const response = await axios.get(`${API_BASE_URL}/api/employee`, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
  
          console.log(response.data)
          if (response.data && response.data.success) {
            let sno = 1
            const data = response.data.employees.map((emp) => ({
              _id: emp._id,
              sno: sno++,
              dep_name: emp.department.dep_name,
              name: emp.userId.name, 
              dob: new Date(emp.dob).toLocaleDateString(),
              profileImage:<img
  src={`${API_BASE_URL}/uploads/${emp.userId.profileImage}`}
  alt="profile"
  className="w-10 h-10 rounded-full object-cover"
/>
,
              action: <EmployeeButtons _id={emp._id} />
            }))
            setEmployees(data)
            setFilteredEmployees(data)
         
          }
        } catch (error) {
          console.error('Failed to fetch departments:', error)
        } finally {
          setEmpLoading(false)
        }
      }
  
      fetchEmployees()
    }, []) 
   const handleFilter = (e) => {
  const value = e.target.value.toLowerCase()

  const records = employees.filter((emp) =>
    emp.name.toLowerCase().includes(value)
  )

  setFilteredEmployees(records)
}


  return (
    <div className = 'text-center'>
        <div className="p-5">
          
            <h3 className='text-2xl font-bold'> Manage Employee</h3>
          </div>
    
          <div className='flex justify-between items-center mb-4'>
            <input
              type="text"
              placeholder="search by Department"
              onChange={handleFilter}
              className="px-4 py-1 border border-gray-300 rounded bg-gray-200 text-black placeholder-gray-600"
            //   onChange={filterDepartments}
            />
            <Link to="/admin-dashboard/employees/add-employees" className='px-4 py-1 bg-teal-600 rounded text-white'>Add New Employee</Link>
          </div>
          <div>
            <StyleSheetManager shouldForwardProp={forwardedFilter}>
              <DataTable columns={columns} data={filterdEmployees} />
            </StyleSheetManager>
          </div>
          </div>
  )
}

export default List