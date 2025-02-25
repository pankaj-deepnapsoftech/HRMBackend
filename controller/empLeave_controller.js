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
  const { fromDate, toDate, halfLeave, fullLeave } = req.body;
  const { employeeId } = req.params;

  try {
    // Find employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Get updated leave limits from DB
    const maxHalfDayLeaves = employee.halfDayLeavesThisMonth || 5; // Corrected
    const maxFullDayLeaves = employee.fullDayLeavesThisMonth || 3; // Corrected

    // Validate leave request
    if (halfLeave) {
      if (employee.halfDayLeavesThisMonth <= 0) {
        return res.status(400).json({
          message: `You have exhausted your half-day leaves for this month.`,
        });
      }
      employee.halfDayLeavesThisMonth -= 1; // Deduct leave
    } else if (fullLeave) {
      if (employee.fullDayLeavesThisMonth <= 0) {
        return res.status(400).json({
          message: `You have exhausted your full-day leaves for this month.`,
        });
      }
      employee.fullDayLeavesThisMonth -= 1; // Deduct leave
    } else {
      return res.status(400).json({ message: "Invalid leave type." });
    }

    // Append leave request
    employee.requestLeave.push({ fromDate, toDate, halfLeave, fullLeave });

    // Save updated data
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Leave request added successfully",
      updatedLeaves: {
        fullDayLeaves: employee.fullDayLeavesThisMonth,
        halfDayLeaves: employee.halfDayLeavesThisMonth,
      },
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
