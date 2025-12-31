import React, { useEffect, useState } from 'react'
import { FaUserTie, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa'
import SummaryCard from './SummaryCard'
import { useAuth } from '../context/authContext'
import axios from 'axios'
import { Link } from 'react-router-dom'

const EmployeeSummary = () => {
  const { user } = useAuth()
  const [leaveCount, setLeaveCount] = useState(null)
  const [latestPay, setLatestPay] = useState(null)

  useEffect(() => {
    if (!user?._id) return
    const token = localStorage.getItem('token')

    const fetchLeaves = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/leave/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const leaves = Array.isArray(res.data?.leaves) ? res.data.leaves : []
        setLeaveCount(leaves.length)
      } catch (err) {
        console.error('Failed to fetch leaves:', err)
        setLeaveCount(0)
      }
    }

    const fetchSalary = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/salary/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const salaries = res.data?.salaries ?? res.data?.salary ?? []
        if (Array.isArray(salaries) && salaries.length > 0) {
          const latest = salaries.reduce((a, b) => {
            const aDate = new Date(a.payDate || a.createdAt || a._id)
            const bDate = new Date(b.payDate || b.createdAt || b._id)
            return aDate > bDate ? a : b
          })
          const net = latest.netSalary ?? (Number(latest.basicSalary || 0) + Number(latest.allowances || 0) - Number(latest.deductions || 0))
          setLatestPay(net)
        } else {
          setLatestPay(null)
        }
      } catch (err) {
        console.error('Failed to fetch salary:', err)
        setLatestPay(null)
      }
    }

    fetchLeaves()
    fetchSalary()
  }, [user?._id])

  const formattedPay = latestPay != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(latestPay) : '—'

  return (
    <>
      <div className='p-6'>
        <h3 className='text-2xl font-bold'>Welcome</h3>
        <p className='text-gray-600'>Overview of your account</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 mt-6'>
        <SummaryCard
          icon={<FaUserTie />}
          text={user?.name || 'My Profile'}
          number={<Link to={`/employee-dashboard/profile/${user?._id ?? ''}`} className="text-teal-600">View</Link>}
          color="bg-teal-600"
        />
        <SummaryCard icon={<FaCalendarAlt />} text="Leaves" number={leaveCount ?? '—'} color="bg-yellow-600" />
        <SummaryCard icon={<FaMoneyBillWave />} text="Latest Pay" number={formattedPay} color="bg-red-600" />
      </div>
    </>
  )
}

export default EmployeeSummary
