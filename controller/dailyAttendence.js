import moment from "moment";
import { Employee } from "../modules/employee_modules.js";

// Fetch attendance details for all employees for today's date
const getTodayAttendance = async (req, res) => {
  try {
    const todayDate = moment().format("YYYY-MM-DD");

    // Fetch all employees and filter their attendance for today's date
    const employees = await Employee.find(
      {},
      "firstName lastName email attendance "
    );

    // Map through employees to extract today's attendance
    const attendanceData = employees.map((employee) => {
      const todayAttendance = employee.attendance.find(
        (att) => att.date === todayDate
      );
      return {
        employeeId: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        status: todayAttendance ? todayAttendance.status : "Absent", // Default to "Absent" if no record for today
        loginTime: todayAttendance?.loginTime || null,
        logoutTime: todayAttendance?.logoutTime || null,
      };
    });

    res.status(200).json({
      message: `Attendance details for ${todayDate}.`,
      attendance: attendanceData,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching today's attendance.",
        error: error.message,
      });
  }
};

export default getTodayAttendance;
