 import axios from 'axios'
 import { useNavigate } from 'react-router-dom'
 import { useEffect, useState } from 'react'
 import API_BASE_URL from '../config/api'

 export const columns = [
    {
        name: "S NO",
        selector: (row) => row.sno,
          sortable: true,
          width: "70px"
    },
      {
        name: "Name",
        selector: (row) => row.name,
          sortable: true,
          width: "200px"
    },
    {
        name: "Image",
        selector: (row) => row.profileImage,
        sortable: false,
        width: "150px"
        
    },
     {
        name: "Department",
        selector: (row) => row.dep_name,
         width: "150px"
        
    },
      {
        name: "DOB",
        selector: (row) => row.dob,
        width: "150px"
    },
    {
        name: "Action",
        selector: (row) => row.action,
        center: "true"
    }

]
 export const fetchDepartments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/department/list`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return (response?.data?.success && response.data.departments) ? response.data.departments : [];
  } catch (error) {
    console.error('Failed to fetch departments:', error?.message || error);
    return [];
  }
}

export const getEmployees = async (id) => {
  if (!id) return [];
  try {
    // Prefer the descriptive endpoint
    const response = await axios.get(`${API_BASE_URL}/api/employee/department/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return (response?.data?.success && response.data.employees) ? response.data.employees : [];
  } catch (error) {
    console.error('Failed to fetch employees for department:', error?.message || error);
    return [];
  }
}

    
    export const EmployeeButtons = ({ _id }) => {
        const navigate = useNavigate()
    
      
        return (
           <div className="flex space-x-3">
  <button
    className="bg-blue-600 text-white px-6 py-1.5 rounded-lg
               shadow-md hover:shadow-lg
               hover:scale-105 active:scale-95
               transition-all duration-200"
    onClick={() => navigate(`/admin-dashboard/employees/${_id}`)}
  >
    View
  </button>

  <button
    className="bg-green-600 text-white px-6 py-1.5 rounded-lg
               shadow-md hover:shadow-lg
               hover:scale-105 active:scale-95
               transition-all duration-200"
    onClick={() => navigate(`/admin-dashboard/employee/edit/${_id}`)}
  >
    Edit
  </button>

  <button
    className="bg-yellow-600 text-white px-6 py-1.5 rounded-lg
               shadow-md hover:shadow-lg
               hover:scale-105 active:scale-95
               transition-all duration-200"

  onClick={() => navigate(`/admin-dashboard/employees/salary/${_id}`)}
  >
    Salary
  </button>

  <button
    className="bg-red-600 text-white px-6 py-1.5 rounded-lg
               shadow-md hover:shadow-lg
               hover:scale-105 active:scale-95
               transition-all duration-200"
               onClick={() => navigate(`/admin-dashboard/employees/leaves/${_id}`)}
  >
    Leave
  </button>
</div>


        )
    }