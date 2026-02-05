import axios from 'axios';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from '../../context/authContext';
import API_BASE_URL from '../../config/api';

const View = () => {
    const {id: paramId} = useParams();
    const { user } = useAuth();
    const id = paramId || user?._id || user?.id;
    const [employee, setEmployee] = useState(null)
    const [error, setError] = useState(null)

    const getMaritalStatusLabel = (emp) => {
      const value = emp?.maritalStatus ?? emp?.martialStatus
      if (!value) return 'Not set'
      const mapping = { single: 'Single', married: 'Married', male: 'Male', female: 'Female', other: 'Other' }
      return mapping[value] || (value.charAt(0).toUpperCase() + value.slice(1))
    }

     useEffect(() => {
    const fetchEmployee = async () => {

      if (!id) {
        setError('No employee selected')
        return
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/employee/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
        })
        console.log('GET /api/employee/:id response:', response)

        if (response.data && response.data.success) {
            console.log('Employee object from API:', response.data.employee)
            setEmployee(response.data.employee)
        } else {
            // If API returns an error shape or message
            setError(response.data?.message || 'Unexpected API response')
        }
      } catch (error) {
        console.error('Failed to fetch employee:', error, error.response?.data || error.message)
        setError(error.response?.data?.message || error.message || 'Failed to fetch employee')
      } 

    }
    
      fetchEmployee()

  }, [id, user])
  return (
    <>{employee ? (
  <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
    <h2 className="text-2xl font-bold mb-8 text-center">
      Employee Details
    </h2>

    <div className="mb-6 flex justify-center">
      <img
        src={employee?.userId?.profileImage ? `${API_BASE_URL}/uploads/${encodeURIComponent(employee.userId.profileImage)}` : 'https://via.placeholder.com/150'}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover"
      />
    </div>

    <div>
      <div className="flex space-x-3 mb-5">
        <p className="text-lg font-bold">Name:</p>
        <p className="text-lg">{employee.userId.name}</p>
      </div>

      <div className="flex space-x-3 mb-5">
        <p className="text-lg font-bold">Email:</p>
        <p className="text-lg">
          {employee.userId?.email ? (
            <a href={`mailto:${employee.userId.email}`} className="text-teal-600 hover:underline">{employee.userId.email}</a>
          ) : (
            <span className="text-gray-500">Not provided</span>
          )}
        </p>
      </div>

      <div className="flex space-x-3 mb-5">
        <p className="text-lg font-bold">Employee ID:</p>
        <p className="text-lg">{employee.employeeId}</p>
      </div>

      <div className="flex space-x-3 mb-5">
        <p className="text-lg font-bold">Date of Birth:</p>
        <p className="font-medium">
          {new Date(employee.dob).toLocaleDateString()}
        </p>
      </div>

      <div className="flex space-x-3 mb-5">
        <p className="text-lg font-bold">Gender:</p>
        <p className="text-lg">{employee.gender}</p>
      </div>

      <div className="flex space-x-3 mb-5">
        <p className="text-lg font-bold">Department:</p>
        <p className="text-lg">{employee.department.dep_name}</p>
      </div>

      <div className="flex space-x-3 mb-5">
        <p className="text-lg font-bold">Marital Status:</p>
        <p className="text-lg">{getMaritalStatusLabel(employee)}</p>
      </div>
    </div>
  </div>
  ) : (
    error ? <p className="text-red-600">{error}</p> : <p>Loading...</p>
  )}</>
);

}

export default View