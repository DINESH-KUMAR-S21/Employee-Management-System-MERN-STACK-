import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { DepartmentButtons } from '../../utils/DepartmentHelper'
import DataTable from 'react-data-table-component'
import { columns } from '../../utils/DepartmentHelper'
import { StyleSheetManager } from 'styled-components'

// Filter specific props so styled-components doesn't forward them to DOM elements
const filterDataTableProps = (prop) => ![
  'sortActive',
  'headCell',
  'isDragging',
  'dense',
  'fixedHeader',
  'fixedHeaderScrollHeight',
  'striped',
  'highlightOnHover',
  'pointerOnHover',
  'renderAsCell',
  'responsive'
].includes(prop)


const DepartmentList = () => {
  const [departments, setDepartments] = useState([])
  const [depLoading, setDepLoading] = useState(true)
  const [depError, setDepError] = useState(null)
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const [filteredDepartments, setFilteredDepartments] = useState([])

  const onDepartmentDelete = async (id) => {
    // update using functional form to avoid stale closure
    setDepartments(prev => prev.filter(dep => dep._id !== id))
    // Also update the filtered list so UI reflects the deletion immediately
    setFilteredDepartments(prev => prev.filter(dep => dep._id !== id))
    // Reset data table pagination to first page so user sees remaining rows
    setResetPaginationToggle(prev => !prev)
  }

  useEffect(() => {
    const fetchDepartments = async () => {
        setDepLoading(true)
      try {
        const response = await axios.get('http://localhost:5000/api/department/list', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        })

        if (response.data && response.data.success) {
          let sno = 1
          const data = response.data.departments.map((dep) => ({
            _id: dep._id || dep.id || '',
            sno: sno++,
            dep_name: dep.dep_name,
            action: <DepartmentButtons _id={dep._id} onDepartmentDelete={onDepartmentDelete} />
          }))
          setDepartments(data)
          setFilteredDepartments(data)
        }
      } catch (error) {
        console.error('Failed to fetch departments:', error)
      } finally {
        setDepLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const filterDepartments = (e) => {
      const records = departments.filter((dep) => {
          return dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setFilteredDepartments(records)
  }

  return (
    <>{depLoading ? <div className="text-center">Loading...</div> : 
    <div className="p-5">
      <div className='text-center'>
        <h3 className='text-2xl font-bold'> Manage Departments</h3>
      </div>

      <div className='flex justify-between items-center mb-4'>
        <input
          type="text"
          placeholder="search by Department"
          className="px-4 py-1 border border-gray-300 rounded bg-gray-200 text-black placeholder-gray-600"
          onChange={filterDepartments}
        />
        <Link to="/admin-dashboard/departments/add-new-department" className='px-4 py-1 bg-teal-600 rounded text-white'>Add New Department</Link>
      </div>

      <div className="mt-5">
        <StyleSheetManager shouldForwardProp={filterDataTableProps}>
          <DataTable columns={columns} data={filteredDepartments} pagination/>
        </StyleSheetManager>
      </div>
    </div>
    }</>
  )
}

export default DepartmentList