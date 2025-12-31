import {useNavigate} from 'react-router-dom'
import axios from 'axios'


export const columns = [
    {
        name: "S NO",
        selector: (row) => row.sno
    },
    {
        name: "Department",
        selector: (row) => row.dep_name,
        sortable: true
    },
    {
        name: "Action",
        selector: (row) => row.action
    }

]

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
    const navigate = useNavigate()

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this department?")
        if (!confirmed) return

        try {
            const token = localStorage.getItem("token")
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            const response = await axios.delete(`http://localhost:5000/api/department/${id}`, { headers })
            console.log('DELETE /api/department/:id response:', response)

            if (response.data && response.data.success) {
                // call back to parent to remove the department from UI
                onDepartmentDelete && onDepartmentDelete(id)
            } else {
                const message = response.data?.message || 'Unexpected API response'
                console.error('Delete failed:', message)
                alert(message)
            }
        } catch (error) {
            console.error('Failed to delete department:', error, error.response?.data || error.message)
            alert(error.response?.data?.message || error.message || 'Failed to delete department')
        }
    }

    return (
        <div className="flex space-x-2  justify-center">
            <button className="bg-teal-600 text-white px-6 py-1 rounded mr-2"
             onClick={() => navigate(`/admin-dashboard/department/${_id}`)}>Edit</button>
            <button className="bg-red-600 text-white px-6 py-1 rounded"
            onClick={() => handleDelete(_id)}
            >Delete</button>
        </div>
    )
}
