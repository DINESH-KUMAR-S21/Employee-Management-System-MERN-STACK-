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

        // Get total count for pagination
        const totalRecords = await Attendance.countDocuments(query);
        
        const attendanceData = await Attendance.find(query)
            .sort({date: -1, _id: -1})
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate('employeeId')
            .lean(); 

        // Manual population with error handling
        const populatedData = await Promise.all(attendanceData.map(async (record) => {
            try {
                if (record.employeeId) {
                    const employee = await Employee.findById(record.employeeId)
                        .populate('userId')
                        .populate('department')
                        .lean();
                    record.employeeId = employee;
                }
                return record;
            } catch (err) {
                console.error("Error populating record:", record._id, err.message);
                return null;
            }
        }));

        const groupData = populatedData.reduce((result, record) => {
            if (!record) return result;
            
            try {
                if(!result[record.date]){
                    result[record.date] = [];
                }
                // Check if employeeId and related fields exist before accessing
                if(record.employeeId && record.employeeId.userId && record.employeeId.department){
                    result[record.date].push({
                        employeeId: record.employeeId.employeeId,
                        employeeName: record.employeeId.userId.name,
                        departmentName: record.employeeId.department.dep_name,
                        status: record.status || "Not marked"
                    });
                }
            } catch(recordError) {
                console.error("Error processing record:", record._id, recordError.message);
            }
            return result;
        }, {});
        
        return res.status(200).json({ success: true, groupData, totalRecords });
    }catch(error){
        console.error("Attendance report error:", error.message, error.stack);
        return res.status(500).json({ success: false, message: error.message });
    }
}
export { getAttendance, updateAttendance, attendanceReport }