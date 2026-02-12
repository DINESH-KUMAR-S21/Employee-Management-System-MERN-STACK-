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

        const attendanceData = await Attendance.find(query)
            .sort({date: -1, _id: -1})
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate({
                path: 'employeeId',
                populate: [
                    { path: 'userId', select: 'name' },
                    { path: 'department', select: 'dep_name' }
                ]
            });

        // Get total count for pagination
        const totalRecords = await Attendance.countDocuments(query);

        // Group by date with fallback values for deleted employees
        const groupData = {};
        attendanceData.forEach(record => {
            try {
                if (!groupData[record.date]) {
                    groupData[record.date] = [];
                }
                
                // Use fallback values if employee/user/department is deleted
                groupData[record.date].push({
                    employeeId: record.employeeId?.employeeId || "DELETED",
                    employeeName: record.employeeId?.userId?.name || "Deleted Employee",
                    departmentName: record.employeeId?.department?.dep_name || "N/A",
                    status: record.status || "Not marked"
                });
            } catch(recordError) {
                console.error("Error processing record:", record._id, recordError.message);
                // Still add record with fallback values even if error occurs
                if (!groupData[record.date]) {
                    groupData[record.date] = [];
                }
                groupData[record.date].push({
                    employeeId: "DELETED",
                    employeeName: "Deleted Employee",
                    departmentName: "N/A",
                    status: record.status || "Not marked"
                });
            }
        });
        
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