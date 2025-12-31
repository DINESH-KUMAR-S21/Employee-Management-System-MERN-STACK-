
import React, { useEffect, useState } from 'react'
import { fetchDepartments } from '../../utils/EmployeeHelper'
import axios from 'axios'

const Add = () => {

const[departments, setDepartments]=useState([])
const [formData, setFormData] = useState({})

    useEffect(() => {
        const getDepartments = async () => {
        const departments = await fetchDepartments()
        setDepartments(departments)  
        }
        getDepartments()
    }, [])

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if(name === 'image'){
            setFormData((prevData) =>({ ...prevData,
              [name]: files[0]}))
               
        } else {
          setFormData((prevData) =>({ ...prevData,
              [name]: value}))
        }
    }

     const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData()
    Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key])
    })
    // Ensure both spellings are sent for backend compatibility
    try {
      if (formData.martialStatus && !formDataObj.has('maritalStatus')) {
        formDataObj.append('maritalStatus', formData.martialStatus)
      }
      if (formData.maritalStatus && !formDataObj.has('martialStatus')) {
        formDataObj.append('martialStatus', formData.maritalStatus)
      }
    } catch (e) {
      console.warn('FormData.has not supported, skipping alias append')
    }

    // Basic client-side validation
    // if(!department.dep_name || !department.dep_name.trim()){
    //   alert('Department name is required');
    //   return;
    // }

        try{
            // Log FormData entries for debugging (shows file name and other fields)
            for (const pair of formDataObj.entries()) {
                console.log('formData entry:', pair[0], pair[1]);
            }
      const response = await axios.post('http://localhost:5000/api/employee/add', formDataObj, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        
        }
      });
      console.log('Server response:', response);
      if(response.data && response.data.success){
        if (typeof navigate === 'function') {
          navigate('/admin-dashboard/employees')
        } else {
          window.location.href = '/admin-dashboard/employees'
        }
      } else {
        alert(response.data?.message || 'Failed to add employee');
      }
    } catch(error){
      console.error('Add employee error:', error);
      if(error.response){
        console.error('Error response data:', error.response.data);
        alert(error.response.data?.error || `Server error: ${error.response.status}`);
      } else {
        alert(error.message || 'An error occurred');
      }
    }
  }
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
<h2 className="text-2xl font-bold mb-6">Add New Employee</h2>
<form onSubmit = {handleSubmit}>
    <div className = "grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
    
        <label className="block text-sm font-medium text-gray-700">
            Name
        </label>
        <input
            type="text"
            name="name"
            onChange = {handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            placeholder="Enter employee name"
            required
        />
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700">
            Email
        </label>
        <input
            type="email"
            name="email"
             onChange = {handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            placeholder="Enter employee email"
            required
        />
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700">
            Employee ID
        </label>
        <input
        type="text"
        name="employeeId"
         onChange = {handleChange}
        placeholder="Employee ID"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
        required
        />
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700">
            Date of Birth
        </label>
        <input
        type="date"
        name="dob"
         onChange = {handleChange}
        placeholder="DOB"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
        required
        />
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700">
            Gender
        </label>
        <select
        name="gender"
         onChange = {handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
        required
        >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
        </select>
    </div>

     <div>
        <label className="block text-sm font-medium text-gray-700">
            Marital Status
        </label>
        <select
        name="martialStatus"
         onChange = {handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
        required
        >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            
        </select>
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700">
            Designation
        </label>
        <input
        type="text"
        name="designation"
         onChange = {handleChange}
        placeholder="Designation"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
        required
        />
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700">
            Department
        </label>
        <select
        name="department"
         onChange = {handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
        required
        >
            <option value="">Select Department</option>
            {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
            ))}
        </select>
    </div>

     <div>
        <label className="block text-sm font-medium text-gray-700">
            Salary
        </label>
        <input
        type="number"
        name="salary"
         onChange = {handleChange}
        placeholder="Salary"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
        required
        />
    </div>

     <div>
        <label className="block text-sm font-medium text-gray-700">
            Password
        </label>
        <input
        type="password"
        name="password"
        placeholder="******"
         onChange = {handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
        required
        />
    </div>

     <div>
        <label className="block text-sm font-medium text-gray-700">
            Role
        </label>
        <select
        name="role"
         onChange = {handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
        required
        >

            <option value="">Select Role</option>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
        </select>
    </div>

     <div>
        <label className="block text-sm font-medium text-gray-700">
            Upload Image
        </label>
        <input
        type="file"
        name="image"
        placeholder="Upload Imae"
         onChange = {handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
        required
        />
    </div>

</div>
    <button
        type="submit"
        className="mt-6 w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
        Add Employee
    </button>

</form>

    </div>
  )
}

export default Add