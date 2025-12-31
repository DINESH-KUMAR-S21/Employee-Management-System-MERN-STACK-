
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const EditDepartment = () => {
    const { id } = useParams();
    const [department, setDepartment] = useState({})
    const [depLoading, setDepLoading] = useState(true)
    const [error, setError] = useState(null)

   useEffect(() => {
    const fetchDepartments = async () => {
        setDepLoading(true)
        setError(null)
      try {
        const token = localStorage.getItem("token")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const response = await axios.get(`http://localhost:5000/api/department/${id}`, { headers })
        console.log('GET /api/department/:id response:', response)

        if (response.data && response.data.success) {
            setDepartment(response.data.department)
        } else {
            // If API returns an error shape or message
            setError(response.data?.message || 'Unexpected API response')
        }
      } catch (error) {
        console.error('Failed to fetch departments:', error, error.response?.data || error.message)
        setError(error.response?.data?.message || error.message || 'Failed to fetch department')
      } finally {
        setDepLoading(false)
      }
    }

    if (id) fetchDepartments()
  }, [id])

    const handleChange = (e) => {
      const {name, value}=e.target;
      setDepartment({...department, [name]: value})

  }

    const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic client-side validation
    if(!department.dep_name || !department.dep_name.trim()){
      alert('Department name is required');
      return;
    }

    try{
      console.log('Submitting department:', department);
      const response = await axios.put(`http://localhost:5000/api/department/${id}`, department, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json"
        }
      });
      console.log('Server response:', response);
      if(response.data && response.data.success){
        if (typeof navigate === 'function') {
          navigate('/admin-dashboard/departments')
        } else {
          window.location.href = '/admin-dashboard/departments'
        } 
      } else {
        alert(response.data?.message || 'Failed to add department');
      }
    } catch(error){
      console.error('Add department error:', error);
      if(error.response){
        console.error('Error response data:', error.response.data);
        alert(error.response.data?.error || `Server error: ${error.response.status}`);
      } else {
        alert(error.message || 'An error occurred');
      }
    }
  }
    return(
        <>{depLoading ? <div>Loading...</div> : 
        <div className="max-w-3xl mx-auto mt-20 bg-white p-8 rounded-md shadow-md w-130 h-110">
      <h3 className="text-2xl font-semibold mb-8">Edit Department</h3>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit = {handleSubmit}>
        <div>
          <label htmlFor="dep_name" className="text-sm font-medium text-gray-700 mb-3">
            Department Name
          </label>
          <input
            id="dep_name"
            name="dep_name"
            type="text"
            value={department.dep_name || ''}
            onChange={handleChange}
            placeholder="Enter Dep Name"
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 mb-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={department.description || ''}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 mb-3"
          />
        </div>

        <button className="bg-teal-600 text-white px-4 py-3 rounded w-full">
          Edit Department
        </button>
      </form>
    </div>
}</>
    )
}

export default EditDepartment
