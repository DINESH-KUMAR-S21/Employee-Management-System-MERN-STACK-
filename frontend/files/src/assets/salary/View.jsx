import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

const View = () => {
  const [salaries, setSalaries] = useState([])
  const [filteredSalaries, setFilteredSalaries] = useState([])
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  let sno = 1

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/salary/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (response.data && response.data.success) {
        const data = Array.isArray(response.data.salaries) ? response.data.salaries : []
        setSalaries(data)
        setFilteredSalaries(data)
      } else {
        setSalaries([])
        setFilteredSalaries([])
      }
    } catch (error) {
      console.error('Failed to fetch salaries:', error?.message || error)
      // keep salaries/filteredSalaries as empty arrays
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSalaries()
  }, [])

  const filterSalaries = (q) => {
    if (!Array.isArray(salaries) || salaries.length === 0) {
      setFilteredSalaries([])
      return
    }

    const query = (q || '').toString().toLowerCase()
    const filteredRecords = salaries.filter((salary) =>
      (salary.month || '').toString().toLowerCase().includes(query)
    )
    setFilteredSalaries(filteredRecords)
  }

  if (loading) return <div className="text-center mt-10">Loading...</div>

  return (
    <>
      <div className="overflow-x-auto p-5">
        <div className="text-center">
          <h2 className="text-xl font-bold">Salary History</h2>
        </div>

        <div className="flex justify-end my-3">
          <input
            type="text"
            placeholder="Search by month"
            className="border px-2 rounded-md py-0.5 border-gray-300"
            onChange={(e) => filterSalaries(e.target.value)}
          />
        </div>

        {filteredSalaries && filteredSalaries.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th className="px-6 py-3">SNO</th>
                <th className="px-6 py-3">Emp ID</th>
                <th className="px-6 py-3">Salary</th>
                <th className="px-6 py-3">Allowance</th>
                <th className="px-6 py-3">Deduction</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Pay Date</th>
              </tr>
            </thead>

            <tbody>
              {(filteredSalaries || []).map((salary) => (
                <tr
                  key={salary._id}
                  className="bg-white border-b"
                >
                  <td className="px-6 py-3">{sno++}</td>
                  <td className="px-6 py-3">{salary.employeeId?.employeeId || '—'}</td>
                  <td className="px-6 py-3">{salary.basicSalary}</td>
                  <td className="px-6 py-3">{salary.allowances}</td>
                  <td className="px-6 py-3">{salary.deductions}</td>
                  <td className="px-6 py-3">{salary.netSalary}</td>
                  <td className="px-6 py-3">{salary.payDate ? new Date(salary.payDate).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center mt-6 text-gray-600">No salary records found.</div>
        )}
      </div>
    </>
  )
}

export default View
