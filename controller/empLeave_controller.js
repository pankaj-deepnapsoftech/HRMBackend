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
  const { fromDate, toDate, halfLeave, fullLeave, reason } = req.body;
  const { employeeId } = req.params;

  try {
    // Find employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Count total pending and approved leaves
    const pendingHalfLeaves = employee.requestLeave.filter(leave => leave.halfLeave && leave.status !== "Rejected").length;
    const pendingFullLeaves = employee.requestLeave.filter(leave => leave.fullLeave && leave.status !== "Rejected").length;

    // Validate leave request (Pending + Approved should not exceed limit)
    if (halfLeave) {
      if (pendingHalfLeaves >= employee.halfDayLeavesThisMonth) {
        return res.status(400).json({ message: `You have exhausted your half-day leaves for this month.` });
      }
    } else if (fullLeave) {
      if (pendingFullLeaves >= employee.fullDayLeavesThisMonth) {
        return res.status(400).json({ message: `You have exhausted your full-day leaves for this month.` });
      }
    } else {
      return res.status(400).json({ message: "Invalid leave type." });
    }

    // Append leave request with status "pending"
    employee.requestLeave.push({
      fromDate,
      toDate,
      halfLeave,
      fullLeave,
      reason,
      status: "Pending", // Leave request starts as pending
    });

    await employee.save();

    res.status(200).json({
      success: true,
      message: "Leave request submitted successfully, awaiting approval.",
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

    // Find employee
    const employee = await Employee.findById(userId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Find leave request
    const leave = employee.requestLeave.find(leave => leave._id.toString() === leaveId);
    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave request not found" });
    }

    // If already approved/rejected, return early
    if (leave.status === status) {
      return res.status(400).json({ success: false, message: `Leave is already ${status}` });
    }

    if (status === "Approved") {
      // Deduct leave balance when approving
      if (leave.halfLeave && employee.halfDayLeavesThisMonth > 0) {
        employee.halfDayLeavesThisMonth -= 1;
      }
      if (leave.fullLeave && employee.fullDayLeavesThisMonth > 0) {
        employee.fullDayLeavesThisMonth -= 1;
      }
    } else if (status === "Rejected" && leave.status === "Approved") {
      // Restore balance if previously approved but now rejected
      if (leave.halfLeave) {
        employee.halfDayLeavesThisMonth += 1;
      }
      if (leave.fullLeave) {
        employee.fullDayLeavesThisMonth += 1;
      }
    }

    // Update leave status
    leave.status = status;
    await employee.save();

    res.status(200).json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully.`,
      updatedLeaves: {
        fullDayLeaves: employee.fullDayLeavesThisMonth,
        halfDayLeaves: employee.halfDayLeavesThisMonth,
      },
    });
  } catch (error) {
    console.error("Error updating leave request status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export { addRequestLeave, updateLeaveRequest, getLeaveLimits };
