import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { fetchDepartments, getEmployees } from '../../utils/EmployeeHelper'

const Add = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [salary, setSalary] = useState({
    employeeId: null,
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: null
})

  const [departments, setDepartments] = useState([])

  const [employees, setEmployees] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [errorDetail, setErrorDetail] = useState(null)

  /* -------------------- FETCH DEPARTMENTS -------------------- */
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const deps = await fetchDepartments()
        setDepartments(deps || [])
        setLoading(false)
      } catch (err) {
        console.error('Department fetch error:', err)
        setError('Failed to load departments')
        setLoading(false)
      }
    }
    loadDepartments()
  }, [])

   const handleDepartment = async (e) => {
     const depId = e.target.value
     setSelectedDepartment(depId)
     try {
       setLoadingEmployees(true)
       const emps = await getEmployees(depId)
       setEmployees(emps || [])
       // clear any previously selected employee when department changes
       setSalary((prev) => ({ ...prev, employeeId: null }))
     } catch (err) {
       console.error('Employee fetch error:', err)
       setError('Failed to load employees')
     } finally {
       setLoadingEmployees(false)
     }

   }


  /* -------------------- HANDLE CHANGE -------------------- */
  const handleChange = (e) => {
    const { name, value, type } = e.target
    const val = type === 'number' ? Number(value) : value
    setSalary((prev) => ({ ...prev, [name]: val }))
  }

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // helpful debug log
    const url = `http://localhost:5000/api/salary/add`
    console.log('POST', url, 'payload:', salary)
    // clear previous errors
    setError(null)
    setErrorDetail(null)

    try {
      const res = await axios.post(url, salary, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      console.log('POST /api/salary/add response:', res.status, res.data)

      if (res.data?.success) {
        navigate('/admin-dashboard/employees')
      } else {
        setError(res.data?.message || 'Update failed')
        setErrorDetail({ status: res.status, data: res.data })
      }
    } catch (err) {
      console.error('Salary add error:', err)
      const serverMsg = err.response?.data?.message
      const status = err.response?.status
      setError(serverMsg || `Request failed with status ${status || err.message}`)
      setErrorDetail({ status, data: err.response?.data })
    }
  }

  /* -------------------- UI -------------------- */
  if (loading) return <div className="text-center mt-10">Loading...</div>

 return (
  <>
    {departments ? (
      <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6">Add Salary</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 font-medium">{error}</p>
            {errorDetail && (
              <pre className="mt-2 text-sm text-gray-700 overflow-auto max-h-40">{JSON.stringify(errorDetail, null, 2)}</pre>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
             <select
  name="department"
  value={selectedDepartment}
  onChange={handleDepartment}
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

            {/* Employee */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employee
              </label>
              <select
                name="employeeId"
                onChange={handleChange}
                value={salary.employeeId || ''}
                disabled={loadingEmployees}
                className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                required
              >
                <option value="">{loadingEmployees ? 'Loading employees...' : 'Select Employee'}</option>
                {!loadingEmployees && (employees || []).map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employeeId}
                  </option>
                ))}
              </select>
            </div>

            {/* Basic Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Basic Salary
              </label>
              <input
                type="number"
                name="basicSalary"
                placeholder="Basic salary"
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            {/* Allowances */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Allowances
              </label>
              <input
                type="number"
                name="allowances"
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            {/* Deduction */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deduction
              </label>
              <input
                type="number"
                name="deductions"
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            {/* Pay Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pay Date
              </label>
              <input
                type="date"
                name="payDate"
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition"
          >
            Add Salary
          </button>
        </form>
      </div>
    ) : (
      <div className="text-center mt-10">Loading...</div>
    )}
  </>
)
}

export default Add
