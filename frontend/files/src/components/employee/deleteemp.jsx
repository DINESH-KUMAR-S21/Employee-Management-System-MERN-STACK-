import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { fetchDepartments, getEmployees } from '../../utils/EmployeeHelper'
import API_BASE_URL from '../../config/api'

const DeleteEmp = () => {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const deps = await fetchDepartments()
        setDepartments(deps || [])
      } catch (err) {
        console.error('Department fetch error:', err)
        setError('Failed to load departments')
      } finally {
        setLoading(false)
      }
    }
    loadDepartments()
  }, [])

  const handleDepartment = async (e) => {
    const depId = e.target.value
    setSelectedDepartment(depId)
    setSelectedEmployee('')
    try {
      setLoadingEmployees(true)
      const emps = await getEmployees(depId)
      setEmployees(emps || [])
    } catch (err) {
      console.error('Employee fetch error:', err)
      setError('Failed to load employees')
    } finally {
      setLoadingEmployees(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!selectedEmployee) return setError('Please select an employee to delete')

    const confirmed = window.confirm('Are you sure you want to delete this employee?')
    if (!confirmed) return

    // prefer localhost when running in development (Vite dev server), otherwise prefer API_BASE_URL
    const localBase = 'http://localhost:5000'
    const deployedBase = API_BASE_URL ? API_BASE_URL.replace(/\/$/, '') : ''
    const isDev = typeof import.meta !== 'undefined' && Boolean(import.meta.env && import.meta.env.DEV)
    const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

    const preferred = isDev ? localBase : deployedBase
    const fallback = isLocalHost ? deployedBase : localBase
    const candidates = [preferred, fallback].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i)

    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
    let lastError = null

    for (const base of candidates) {
      const url = `${base.replace(/\/$/, '')}/api/employee/${selectedEmployee}`
      console.log('Attempting DELETE at:', url)
      try {
        const res = await axios.delete(url, { headers })
        if (res.data?.success) {
          navigate('/admin-dashboard/employees')
          return
        }
        lastError = res.data?.message || `Delete failed at ${base}`
        break
      } catch (err) {
        const status = err?.response?.status
        console.warn(`Delete at ${base} failed:`, status || err.message)
        // try next candidate on network error or 404
        if (!err.response || status === 404) {
          lastError = err.response?.data?.message || err.message
          continue
        }
        // other HTTP errors -> stop
        lastError = err.response?.data?.message || err.message || 'Delete failed'
        break
      }
    }

    setError(lastError || 'Delete failed on all endpoints')
  }

  if (loading) return <div className="text-center mt-10">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Delete Employee</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              name="department"
              value={selectedDepartment}
              onChange={handleDepartment}
              className="mt-1 w-full px-3 py-2 border rounded-md"
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <select
              name="employee"
              onChange={(e) => setSelectedEmployee(e.target.value)}
              value={selectedEmployee}
              disabled={loadingEmployees || !employees || employees.length === 0}
              className="mt-1 w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">
                {loadingEmployees ? 'Loading employees...' : employees && employees.length > 0 ? 'Select Employee' : 'No employee found'}
              </option>
              {!loadingEmployees && (employees || []).map((emp) => (
                <option key={emp._id} value={emp._id}>
                  { (emp.userId && emp.userId.name) || emp.employeeId || emp._id }
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
        >
          Delete Employee
        </button>
      </form>
    </div>
  )
}

export default DeleteEmp