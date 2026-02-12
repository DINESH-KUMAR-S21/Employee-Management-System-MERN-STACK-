import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AuthProvider from "./context/authContext";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/privateRoute";
import RoleBasedRoutes from "./utils/RoleBaseRoutes";
import AdminSummary from "./components/AdminSummary";
import DepartmentList from "./components/department/DepartmentList";  
import AddDepartment from "./components/department/AddDepartment";
import EditDepartment from "./components/department/EditDepartment";
import List from "./components/employee/List";
import Add from "./components/employee/Add";
import View from "./components/employee/View";
import Edit from "./components/employee/Edit";
import AddSalary from "./assets/salary/Add";
import ViewSalary from "./assets/salary/View";
import EmployeeSummary from "./components/EmployeeSummary";
import LeaveList from "./components/leave/list";
import AddLeave from "./components/leave/Add";
import Setting from "./components/EmployeeDashboard/Setting";
import Table from "./components/leave/Table";
import Detail from "./components/leave/Detail";
import Unauthorized from "./pages/Unauthorized";
import Attendance from "./components/attendence/Attendance";
import AttendanceReport from "./components/attendence/AttendanceReport";
import DeleteEmp from "./components/employee/deleteemp";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/admin-dashboard" element={
            <PrivateRoutes>
              <RoleBasedRoutes requiredRole={['admin']}>
                <AdminDashboard />
              </RoleBasedRoutes>
            </PrivateRoutes>
          }>
            <Route index element={<AdminSummary />} />
            <Route path="departments" element={<DepartmentList />} />
          
            <Route path="departments/add-new-department" element={<AddDepartment />} />
            <Route path="department/:id" element={<EditDepartment />} />
            <Route path="employees" element={<List />} />
            <Route path="employees/add-employees" element={<Add />} />
              <Route path="employees/delete-employee" element={<DeleteEmp />} />
            <Route path="employees/:id" element={<View />} />
            <Route path="employee/edit/:id" element={<Edit />} />
            <Route path="employees/salary/:id" element={<ViewSalary />} />
            <Route path="salary/add" element={<AddSalary />} />
            <Route path="leaves" element={<Table />} />
            <Route path="leaves/:id" element={<Detail />} />
            <Route path="employees/leaves/:id" element={<LeaveList />} />
            <Route path="settings" element={<Setting />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="attendance-report" element={<AttendanceReport />} />

          </Route>
          <Route path="/employee-dashboard" element={
            <PrivateRoutes>
              <RoleBasedRoutes requiredRole={["employee"]}>
                <EmployeeDashboard />
              </RoleBasedRoutes>
            </PrivateRoutes>
          }>
            <Route index element={<EmployeeSummary />} />
            <Route path="profile/:id?" element={<View />} />
            <Route path="leaves/:id" element={<LeaveList />} />
            <Route path="leaves/add-leave" element={<AddLeave />} />
            <Route path="salary/:id" element={<ViewSalary />} />
            <Route path="settings/" element={<Setting />} />
          </Route>
         
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
