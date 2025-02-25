import { Employee } from "../modules/employee_modules.js"; // Import Employee model
import ApiError from "../utlis/ApiError.js"; // Import custom error handler

const updateEmployeeLeaveBalance = async (req, res) => {
  const { employeeId, leaveType, amount, action } = req.body; // Extract input data

  try {
    // Find the employee by ID
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    // Validate leave type
    if (!["fullDay", "halfDay"].includes(leaveType)) {
      throw new ApiError(400, "Invalid leave type");
    }

    // Validate action type
    if (!["increase", "decrease"].includes(action)) {
      throw new ApiError(400, "Invalid action type. Use 'increase' or 'decrease'");
    }

    // Ensure amount is a positive number
    if (amount <= 0) {
      throw new ApiError(400, "Amount should be greater than 0");
    }

    // Check if the month has changed and reset leave counts
    const currentMonth = new Date().getMonth();
    const lastUpdatedMonth = employee.updatedAt?.getMonth();

    if (lastUpdatedMonth !== currentMonth) {
      employee.fullDayLeavesThisMonth = 0;
      employee.halfDayLeavesThisMonth = 0;
    }

    // Update leave balance dynamically
    if (leaveType === "fullDay") {
      employee.fullDayLeavesThisMonth =
        action === "increase"
          ? employee.fullDayLeavesThisMonth + amount
          : Math.max(0, employee.fullDayLeavesThisMonth - amount); // Prevent negative values
    } else if (leaveType === "halfDay") {
      employee.halfDayLeavesThisMonth =
        action === "increase"
          ? employee.halfDayLeavesThisMonth + amount
          : Math.max(0, employee.halfDayLeavesThisMonth - amount); // Prevent negative values
    }

    // Save the updated employee document
    await employee.save();

    // Respond with success
    res.status(200).json({
      success: true,
      message: `Successfully ${action}d ${amount} ${leaveType} leave(s).`,
      updatedEmployee: {
        fullDayLeavesThisMonth: employee.fullDayLeavesThisMonth,
        halfDayLeavesThisMonth: employee.halfDayLeavesThisMonth,
      },
    });
  } catch (error) {
    console.error("Error updating leave balance:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export default updateEmployeeLeaveBalance;
