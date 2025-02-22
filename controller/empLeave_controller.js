import { Employee } from "../modules/employee_modules.js";
import ApiError from "../utlis/ApiError.js";
import ApiResponse from "../utlis/ApiResponse.js";

// Get Leave Limits from Admin
const getLeaveLimits = async (req, res) => {
  const { employeeId } = req.params; // Ensure employeeId is passed as a route parameter

  try {
    // Fetch employee details by ID
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Ensure leave counters exist
    const leaveLimits = {
      fullDayLeaves: employee.fullDayLeavesThisMonth || 0,
      halfDayLeaves: employee.halfDayLeavesThisMonth || 0,
    };


    // Respond with the current leave limits
    res.status(200).json({
      success: true,
      leaveLimits,
    });
  } catch (error) {
    console.error("Error fetching leave limits:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to add a leave request for an employee
const addRequestLeave = async (req, res) => {
  const { fromDate, toDate, halfLeave, fullLeave } = req.body; // Request leave data
  const { employeeId } = req.params; // Employee ID from URL

  try {
    // Check if the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Fetch admin-approved leave limits (fallback to default values if not set)
    const maxHalfDayLeaves = employee.fullDayLeavesThisMonth || 5; // Default 5 half-day leaves
    const maxFullDayLeaves = employee.halfDayLeavesThisMonth || 3; // Default 3 full-day leaves

    // Validate the leave request
    if (halfLeave) {
      if (employee.halfDayLeavesThisMonth >= maxHalfDayLeaves) {
        return res.status(400).json({
          message: `You have exhausted your ${maxHalfDayLeaves} half-day leaves for this month.`,
        });
      }

      // Update the leave balance
      employee.halfDayLeavesThisMonth += 1; // Increment half-day leaves
    } else if (fullLeave) {
      if (employee.fullDayLeavesThisMonth >= maxFullDayLeaves) {
        return res.status(400).json({
          message: `You have exhausted your ${maxFullDayLeaves} full-day leaves for this month.`,
        });
      }

      // Update the leave balance
      employee.fullDayLeavesThisMonth += 1; // Increment full-day leaves
    } else {
      return res.status(400).json({ message: "Invalid leave type." });
    }

    // Append the new leave request to employee's leave history
    employee.requestLeave.push({ fromDate, toDate, halfLeave, fullLeave });

    // Save the updated employee data with the new leave request
    const updatedEmployee = await employee.save();

    res.status(200).json({
      success: true,
      message: "Leave request added successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("Error while submitting leave request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// reuest leave status for approval by admin
const updateLeaveRequest = async (req, res) => {
  try {
    const { userId, leaveId, status } = req.body;

    // Find the employee by ID
    const employee = await Employee.findById(userId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Find the leave request by ID
    const leave = employee.requestLeave.find(
      (leave) => leave._id.toString() === leaveId
    );
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    // Update the leave status
    leave.status = status;

    // Save the updated employee document
    await employee.save();

    res.status(200).json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully.`,
      updatedEmployee: employee, // Return updated employee data
    });
  } catch (error) {
    console.error("Error updating leave request status:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export { addRequestLeave, updateLeaveRequest, getLeaveLimits };
