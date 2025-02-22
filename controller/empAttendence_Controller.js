import moment from "moment";
import { Employee } from "../modules/employee_modules.js";

const markAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Fetch the employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Get today's date and current time
    const todayDate = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("HH:mm:ss");

    // Get the last attendance date to fill in absents for missing dates
    const lastAttendanceDate = employee.attendance.length
      ? moment(employee.attendance[employee.attendance.length - 1].date)
      : null;

    if (lastAttendanceDate) {
      // Fill in absent records for days between lastAttendanceDate and todayDate
      const diffDays = moment(todayDate).diff(lastAttendanceDate, "days");
      for (let i = 1; i < diffDays; i++) {
        const missingDate = lastAttendanceDate.add(1, "days").format("YYYY-MM-DD");
        employee.attendance.push({
          date: missingDate,
          status: "Absent",
          loginTime: null,
        });
      }
    }

    // Check if attendance for today is already marked
    const existingAttendance = employee.attendance.find(
      (att) => att.date === todayDate
    );

    if (!existingAttendance) {
      // Mark attendance as 'Present' for today with login time
      employee.attendance.push({
        date: todayDate,
        status: "Present",
        loginTime: currentTime, // Save login time only once
      });

      // Update loginDate and loginTime fields for today
      employee.loginDate = todayDate;
      employee.loginTime = currentTime;

      await employee.save();
    }

    // Fetch the employee's attendance history
    const attendanceHistory = employee.attendance.map((record) => ({
      date: record.date,
      status: record.status,
      loginTime: record.loginTime || "N/A",
    }));

    // Response with today's attendance and the complete attendance history
    res.status(200).json({
      today: {
        date: todayDate,
        loginTime: employee.loginTime,
        status: existingAttendance ? existingAttendance.status : "Present",
      },
      attendanceHistory,
      message: "Attendance marked and fetched successfully",
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default markAttendance;
