import { Employee } from "../modules/employee_modules.js";

const updateEmployeeLeaveBalance = async (req, res) => {
  const { employeeId, leaveType, amount, action } = req.body; // leaveType = 'fullDay' or 'halfDay', action = 'increase' or 'decrease'

  try {
    // Find the employee by ID
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Validate leave type
    if (leaveType !== "fullDay" && leaveType !== "halfDay") {
      return res.status(400).json({ message: "Invalid leave type" });
    }

    // Validate action type
    if (action !== "increase" && action !== "decrease") {
      return res
        .status(400)
        .json({ message: "Invalid action type. Use 'increase' or 'decrease'" });
    }

    // Ensure amount is a positive number
    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount should be greater than 0" });
    }

    // Update the employee's leave balance
    await employee.updateLeaveBalance(leaveType, amount, action);

    // Respond with success
    res.status(200).json({
      success: true,
      message: `Successfully ${action}d ${leaveType} leave by ${amount} days.`,
      updatedEmployee: employee,
    });
  } catch (error) {
    console.error("Error updating leave balance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default updateEmployeeLeaveBalance;
