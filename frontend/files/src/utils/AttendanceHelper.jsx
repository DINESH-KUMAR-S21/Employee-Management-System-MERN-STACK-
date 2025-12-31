import React from 'react';
import axios from 'axios';


 export const columns = [
    {
        name: "S NO",
        selector: (row) => row.sno,
          sortable: true,
          width: "100px"
    },
      {
        name: "Emp ID",
        selector: (row) => row.employeeId,
          sortable: true,
          width: "200px"
    },

       {
        name: "Name",
        selector: (row) => row.name,
          sortable: true,
          width: "200px"
    },

     {
        name: "Department",
        selector: (row) => row.department,
         width: "150px"
        
    },
  
    {
        name: "Action",
        selector: (row) => row.action,
        center: "true"
    }

]

export const AttendanceHelper = ({status, employeeId, statusChange}) => {
    const markEmployee = async (status, employeeId) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/attendance/update/${employeeId}`, {status}, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })

            if(response.data.success){
                statusChange()
            }
        } catch (err) {
            console.error('Failed to update attendance:', err)
        }
    }
    return(
        <div>
            {status == null ? (
               <div className="flex space-x-8">
                <button
  className="bg-green-600 text-white px-6 py-1.5 rounded-lg
               shadow-md hover:shadow-lg
               hover:scale-105 active:scale-95
               transition-all duration-200"
               onClick={() => markEmployee("present", employeeId)}
               >Present</button>

                                <button
  className="bg-red-600 text-white px-6 py-1.5 rounded-lg
               shadow-md hover:shadow-lg
               hover:scale-105 active:scale-95
               transition-all duration-200"
                onClick={() => markEmployee("absent", employeeId)}
               >Absent</button>

                <button
  className="bg-gray-600 text-white px-6 py-1.5 rounded-lg
               shadow-md hover:shadow-lg
               hover:scale-105 active:scale-95
               transition-all duration-200"
                onClick={() => markEmployee("sick", employeeId)}
               >Sick</button>

                               <button
  className="bg-yellow-600 text-white px-6 py-1.5 rounded-lg
               shadow-md hover:shadow-lg
               hover:scale-105 active:scale-95
               transition-all duration-200"
                onClick={() => markEmployee("leave", employeeId)}
               >Leave</button>
               </div>
            ) : (
                <span className={`inline-block px-4 py-1 rounded-lg text-white ${
                    status === 'present' ? 'bg-green-600' :
                    status === 'absent' ? 'bg-red-600' :
                    status === 'sick' ? 'bg-gray-600' :
                    status === 'leave' ? 'bg-yellow-600' : 'bg-gray-400'
                }`}>
                    {status ? status.charAt(0).toUpperCase() + status.slice(1) : ''}
                </span>
            )
            }
        </div>
    )
}

