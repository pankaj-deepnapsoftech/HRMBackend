import { Employee } from "../modules/employee_modules.js"; // Import Employee model
import ApiError from "../utlis/ApiError.js"; // Import custom error handler

// Endpoint to get leave status for an employee
const getLeaveStatus = async (req, res) => {
  const { employeeId } = req.params; // Employee ID from URL

  try {
    // Find the employee by ID
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    // Get the current month and the last updated month
    const currentMonth = new Date().getMonth();
    const lastUpdatedMonth = employee.updatedAt?.getMonth();

    // If the leave record was last updated in a different month, reset the counts
    if (lastUpdatedMonth !== currentMonth) {
      employee.fullDayLeavesThisMonth = 0;
      employee.halfDayLeavesThisMonth = 0;
      await employee.save(); // Save the reset values in the database
    }

    // Return the updated leave status
    res.status(200).json({
      success: true,
      message: "Leave status fetched successfully",
      leaveStatus: {
        fullDayLeaves: employee.fullDayLeavesThisMonth,
        halfDayLeaves: employee.halfDayLeavesThisMonth,
      },
    });
  } catch (error) {
    console.error("Error fetching leave status:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export { getLeaveStatus };
