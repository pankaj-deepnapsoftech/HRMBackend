import { Employee } from "../modules/employee_modules.js"; // Assuming you have an Employee model

// Controller to add an incentive to an employee
const addIncentive = async (req, res) => {
  try {
    const { employeeId, amount, date, notes } = req.body;

    // Check if the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Create a new incentive
    const newIncentive = {
      amount,
      date: date || new Date(),
      notes,
    };

    // Save the incentive in the employee's record
    employee.incentive.push(newIncentive);
    await employee.save();

    res.status(201).json({
      message: "Incentive added successfully",
      incentive: newIncentive,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { addIncentive };
