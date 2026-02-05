import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { fetchDepartments } from '../../utils/EmployeeHelper'
import API_BASE_URL from '../../config/api'

const Edit = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [departments, setDepartments] = useState([])
  const [employee, setEmployee] = useState({
    name: '',
    martialStatus: '',
    designation: '',
    salary: '',
    department: ''
  })
  const [formData, setFormData] = useState({
    name: '',
    martialStatus: '',
    designation: '',
    salary: '',
    department: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* -------------------- FETCH DEPARTMENTS -------------------- */
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const deps = await fetchDepartments()
        setDepartments(deps || [])
      } catch (err) {
        console.error('Department fetch error:', err)
      }
    }
    loadDepartments()
  }, [])

  /* -------------------- FETCH EMPLOYEE -------------------- */
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )

        console.log('Edit.fetchEmployee: response from server', res)

        if (res.data?.success) {
          const emp = res.data.employee
          setEmployee(emp)
          setFormData({
            name: emp.userId?.name || '',
            martialStatus: emp.martialStatus || '',
            designation: emp.designation || '',
            salary: emp.salary || '',
            department: emp.department || ''
          })
        }
      } catch (err) {
        console.error(err)
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployee()
  }, [id])

  /* -------------------- HANDLE CHANGE -------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formDataObj = new FormData()
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key])
    })

    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/employee/${id}`,
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (res.data?.success) {
        navigate('/admin-dashboard/employees')
      } else {
        alert(res.data?.message || 'Update failed')
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || err.message)
    }
  }

  /* -------------------- UI -------------------- */
  if (loading) return <div className="text-center mt-10">Loading...</div>
  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Employee</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Marital Status
            </label>
            <select
              name="martialStatus"
              value={formData.martialStatus}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
              required
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Salary
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          {/* Department */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
              required
            >
              <option value="">Select Department</option>
              {(departments || []).map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.dep_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition"
        >
          Update Employee
        </button>
      </form>
    </div>
  )
}

export default Edit
