import cron from "node-cron";
import moment from "moment";
import { Employee } from "../../modules/employee_modules.js";

// Scheduled job to mark absent employees at midnight
cron.schedule("1 0 * * *", async () => {
  try {
    const today = moment().format("YYYY-MM-DD");

    // Get all employees
    const employees = await Employee.find();

    for (const employee of employees) {
      // Check if there is already an attendance record for today
      const hasAttendance = employee.attendance.some((att) => att.date === today);

      if (!hasAttendance) {
        // If no login today, mark as Absent
        employee.attendance.push({
          date: today,
          status: "Absent",
          loginTime: null,
        });

        // Save updated attendance
        await employee.save();
      }
    }

    console.log("✅ Absent employees marked successfully for", today);
  } catch (error) {
    console.error("❌ Error updating absent employees:", error);
  }
});
