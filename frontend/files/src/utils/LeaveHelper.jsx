import { useNavigate } from 'react-router-dom'

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
          width: "140px"
    },
    {
        name: "Name",
        selector: (row) => row.name,
        sortable: false,
        width: "140px"
        
    },
     {
        name: "Leave Type",
        selector: (row) => row.leaveType,
         width: "140px"
        
    },
      {
        name: "Department",
        selector: (row) => row.department,
        width: "140px"
    },
    {
        name: "Days",
        selector: (row) => row.days,
        width:"140px"
    },
     {
        name: "Status",
        selector: (row) => row.status,
        width:"110px"
    },
 {
        name: "Action",
        selector: (row) => row.action,
       center: true
    }

]
export const LeaveButtons = ({ ID }) => {
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/admin-dashboard/leaves/${id}`);
  }
  
  return(
    <button
      className="px-4 py-1 bg-teal-500 rounded text-white hover:bg-teal-600"
      onClick={() => handleView(ID)}>
        View
    </button>
  )
}




      