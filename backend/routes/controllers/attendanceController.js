import Attendance from '../../models/Attendance.js';
import Employee from '../../models/Employee.js';

const getAttendance = async (req, res) => {
    try{
    const date = new Date().toISOString().split('T')[0]; 
    const attendance = await Attendance.find({ date}).populate({
        path: "employeeId",
        populate: [
            "department",
            "userId"
        ]
    }); 
    res.status(200).json({ success: true, attendance });
        
    }catch(error){
        res.status(500).json({ success: false, error: "Internal server error" });
    }

}

const updateAttendance = async (req, res) => {
    try{
        const {employeeId} = req.params;
        const {status} = req.body;
        const date = new Date().toISOString().split('T')[0];
        const employee = await Employee.findOne({employeeId})
        const attendance = await Attendance.findOneAndUpdate({employeeId: employee._id, date}, {status}, {new: true});

        res.status(200).json({ success: true, message: "Attendance updated", attendance });
    }catch(error){
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}

const attendanceReport = async (req, res) => {
    try{
        const {date, limit = 5, skip = 0} = req.query;
        const query = {}

        if(date){
            query.date = date;
        }

        // Fetch ALL matching records (no skip/limit here - we'll paginate after grouping)
        const attendanceData = await Attendance.find(query)
            .sort({date: -1, _id: -1})
            .populate({
                path: 'employeeId',
                populate: [
                    { path: 'userId', select: 'name' },
                    { path: 'department', select: 'dep_name' }
                ]
            });

        // Group by date first with fallback values for deleted employees
        const groupedData = {};
        attendanceData.forEach(record => {
            try {
                if (!groupedData[record.date]) {
                    groupedData[record.date] = [];
                }
                
                // Use fallback values if employee/user/department is deleted
                groupedData[record.date].push({
                    employeeId: record.employeeId?.employeeId || "DELETED",
                    employeeName: record.employeeId?.userId?.name || "Deleted Employee",
                    departmentName: record.employeeId?.department?.dep_name || "N/A",
                    status: record.status || "Not marked"
                });
            } catch(recordError) {
                console.error("Error processing record:", record._id, recordError.message);
                // Still add record with fallback values even if error occurs
                if (!groupedData[record.date]) {
                    groupedData[record.date] = [];
                }
                groupedData[record.date].push({
                    employeeId: "DELETED",
                    employeeName: "Deleted Employee",
                    departmentName: "N/A",
                    status: record.status || "Not marked"
                });
            }
        });

        // Get grouped dates array for pagination
        const groupedDates = Object.entries(groupedData); // [[date, records], [date, records], ...]
        const totalRecords = groupedDates.length; // Total number of date groups

        // Apply pagination to grouped dates (not raw records)
        const paginatedDates = groupedDates.slice(parseInt(skip), parseInt(skip) + parseInt(limit));

        // Convert back to object format { [date]: records[] }
        const groupData = Object.fromEntries(paginatedDates);

        return res.status(200).json({ 
            success: true, 
            groupData, 
            totalRecords
        });
    }catch(error){
        console.error("Attendance report error:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || "Server error"
        });
    }
}
export { getAttendance, updateAttendance, attendanceReport }