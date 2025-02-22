import { Employee } from "../modules/employee_modules.js";

const terminateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    console.log("Employee Id", employeeId);

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Update the status to "terminated"
    employee.Empstatus = "terminated";
    await employee.save();

    res.status(200).json({ message: "Employee terminated successfully." });
  } catch (error) {
    console.error("Error terminating employee:", error);
    res
      .status(500)
      .json({ message: "An error occurred while terminating the employee." });
  }
};

export default terminateEmployee;
