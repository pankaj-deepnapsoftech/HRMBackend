// import { Employee } from "../modules/employee_modules.js"; // Adjust path as needed

// // Controller to get active and inactive time
// const getActiveTime = async (req, res) => {
//   try {
//     const employeeId = req.params.empId; // Correct way to access employeeId from params
//     console.log(`Fetching activity time for employee ID: ${employeeId}`);

//     const employee = await Employee.findById(employeeId);
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     // Send the total active time and inactive time as a response
//     res.status(200).json({
//       activeTime: employee.totalActiveTime || 0,
//       inactiveTime: employee.totalInactiveTime || 0, // Ensure inactiveTime is included
//     });
//   } catch (error) {
//     console.error("Error fetching activity time:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // Controller to update active time and inactive time
// const updateActiveTime = async (req, res) => {
//   try {
//     const employeeId = req.params.employeeId;
//     const { activeTime, inactiveTime } = req.body; // Time in minutes

//     // Validate input
//     if (typeof activeTime !== "number" || activeTime < 0) {
//       return res.status(400).json({ message: "Invalid active time" });
//     }
//     if (typeof inactiveTime !== "number" || inactiveTime < 0) {
//       return res.status(400).json({ message: "Invalid inactive time" });
//     }

//     // Find the employee by ID
//     const employee = await Employee.findById(employeeId);
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     // Get the current date in "YYYY-MM-DD" format
//     const currentDate = new Date().toISOString().split("T")[0];

//     // Check if there's already an existing activity for the current date
//     let currentDayActivity = employee.dailyActivity.find(
//       (activity) => activity.date === currentDate
//     );

//     if (currentDayActivity) {
//       // If activity for the current day exists, update the active and inactive times
//       currentDayActivity.activeTime += activeTime;
//       currentDayActivity.inactiveTime += inactiveTime;

//       // Update formatted times for the current day
//       currentDayActivity.formattedActiveTime = formatTime(currentDayActivity.activeTime);
//       currentDayActivity.formattedInactiveTime = formatTime(currentDayActivity.inactiveTime);
//     } else {
//       // If no activity for the current day, create a new entry for the new day
//       const newActivity = {
//         date: currentDate,
//         activeTime: activeTime, // Set the initial active time for the day
//         inactiveTime: inactiveTime, // Set the initial inactive time for the day
//         formattedActiveTime: formatTime(activeTime), // Format the active time
//         formattedInactiveTime: formatTime(inactiveTime), // Format the inactive time
//       };

//       // Assign the new activity to dailyActivity
//       employee.dailyActivity.push(newActivity);
//     }

//     // Recalculate total active and inactive times across all days
//     const totalActiveTime = employee.dailyActivity.reduce(
//       (total, activity) => total + activity.activeTime,
//       0
//     );
//     const totalInactiveTime = employee.dailyActivity.reduce(
//       (total, activity) => total + activity.inactiveTime,
//       0
//     );

//     // Track the number of days with activity or inactivity
//     const totalActivityDays = employee.dailyActivity.filter(
//       (activity) => activity.activeTime > 0
//     ).length;

//     const totalInactivityDays = employee.dailyActivity.filter(
//       (activity) => activity.inactiveTime > 0
//     ).length;

//     // Update the employee's total active and inactive times
//     employee.totalActiveTime = totalActiveTime;
//     employee.totalInactiveTime = totalInactiveTime;
//     employee.totalActivityDays = totalActivityDays;
//     employee.totalInactivityDays = totalInactivityDays;

//     // Store the formatted total active and inactive times
//     employee.formattedTotalActiveTime = formatTime(totalActiveTime);
//     employee.formattedTotalInactiveTime = formatTime(totalInactiveTime);

//     // Save the employee document
//     await employee.save();

//     res.status(200).json({
//       message: "Activity data updated successfully",
//       totalActiveTime: employee.totalActiveTime,
//       totalInactiveTime: employee.totalInactiveTime,
//       totalActivityDays: employee.totalActivityDays,
//       totalInactivityDays: employee.totalInactivityDays,
//       formattedActiveTime: employee.formattedTotalActiveTime,
//       formattedInactiveTime: employee.formattedTotalInactiveTime,
//       dailyActivity: employee.dailyActivity,
//     });
//   } catch (error) {
//     console.error("Error updating activity time:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // Helper function to format time (in minutes) to hh:mm
// const formatTime = (timeInMinutes) => {
//   const hours = Math.floor(timeInMinutes / 60);
//   const minutes = timeInMinutes % 60;
//   return `${hours}hr ${minutes}min`;
// };


// export { getActiveTime, updateActiveTime };
