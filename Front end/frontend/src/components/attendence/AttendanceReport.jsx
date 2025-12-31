import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceReport = () => {
    const [report, setReport] = useState({})
    const [limit, setLimit] = useState(5)
    const [skip, setSkip] = useState(0)
    const [dateFilter, setDateFilter] = useState('')
    const [loading, setLoading] = useState(false) 

    const fetchReport = async () => {
        setLoading(true)
         try {
            const query = new URLSearchParams({ limit, skip })
            if (dateFilter) {
              query.append("date", dateFilter)
            }
            const response = await axios.get(`http://localhost:5000/api/attendance/report?${query.toString()}`, {
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
            })

            console.log('Attendance report query:', query.toString())
            console.log('Attendance report response:', response.data)
  
            if (response.data && response.data.success) {
              // merge groupData (expected to be an object of date -> records)
              const groupData = response.data.groupData || {}
              if (skip == 0) {
                setReport(groupData)
              } else {
                setReport((prevData) => {
                  const merged = { ...prevData };
                  Object.entries(groupData).forEach(([d, recs]) => {
                    if (Array.isArray(merged[d])) {
                      merged[d] = [...merged[d], ...recs];
                    } else {
                      merged[d] = recs;
                    }
                  });
                  return merged;
                });
              }
            }
          } catch (error) {
              alert(error.message)
          } finally {
            setLoading(false)
          }
    }
  
  

    useEffect(() => {
      fetchReport()

    }, [skip, dateFilter])

    const handleLoadmore = () => {
      setSkip((prevSkip) => prevSkip + limit)
    }
    return (
        <div className="min-h-screen p-10 bg-white">
            <h2 className='text-center text-2xl font-bold'>Attendance Report</h2>
            <div className='my-4'>
              <h2 className='text-xl font-semibold'>Filter by Date</h2>
              <input type="date" value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setSkip(0); setReport({}); }} className='border bg-gray-100 p-1'/>
            </div>
            {loading ? <div>Loading...</div> : Object.keys(report || {}).length === 0 ? (
              <div className='text-center text-gray-500'>No attendance records found.</div>
            ) : (
              <>
                {Object.entries(report || {}).map(([date, records]) => (
                <div key={date} className='mb-6'>
                  <h2 className="text-xl font-semibold ">{date}</h2>
                  <div className='overflow-x-auto mt-4'>
                    <table className='w-full table-auto border-collapse text-sm'>
                      <thead className='bg-gray-100'>
                        <tr>
                          <th className='px-4 py-2 text-left w-12'>S No</th>
                          <th className='px-4 py-2 text-left w-36'>Employee ID</th>
                          <th className='px-4 py-2 text-left'>Name</th>
                          <th className='px-4 py-2 text-left'>Department</th>
                          <th className='px-4 py-2 text-left w-28'>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {Array.isArray(records) ? records.map((data, i) => (
                          <tr key={data.employeeId || i} className='odd:bg-white even:bg-gray-50'>
                            <td className='px-4 py-2 text-gray-700'>{i + 1}</td>
                            <td className='px-4 py-2 font-mono text-gray-700'>{data.employeeId}</td>
                            <td className='px-4 py-2 text-gray-700'>{data.employeeName}</td>
                            <td className='px-4 py-2 text-gray-700'>{data.departmentName}</td>
                            <td className='px-4 py-2 text-gray-700'>{data.status}</td>
                          </tr>
                        )) : null}
                      </tbody>

                    </table>
                  </div>
                </div>
                ))}
                <div className='mt-4 text-center'>
                  <button onClick={handleLoadmore} disabled={loading} className='px-4 py-2 border bg-gray-100 text-lg font-semibold disabled:opacity-50'>Load More</button>
                </div>
              </>
            )}
        </div>
            )
  }


export default AttendanceReport;  