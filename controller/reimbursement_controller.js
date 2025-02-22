import { Employee } from "../modules/employee_modules.js";

const addReimbursement = async (req, res) => {
  try {
    const { employeeId, amount,  paymentDate, notes } = req.body;

    // Check if the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

  // Create a new incentive
    const newReimbursement = {
      amount,
      paymentDate,
      notes,
    };

    // Save the incentive in the employee's record
    employee.reimbursement.push(newReimbursement);
    await employee.save();

    res.status(201).json({
      message: "Reimbursement added successfully",
      incentive: newReimbursement,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export { addReimbursement };
