import { Employee } from "../modules/employee_modules.js";

// Update salaries for eligible employees
const updateSalaries = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Find the employee by ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const currentDate = new Date();
    const joiningDate = new Date(employee.date);
    const lastIncrementDate = employee.lastSalaryIncrementDate
      ? new Date(employee.lastSalaryIncrementDate)
      : null;

    // Calculate the difference in years between joiningDate and currentDate
    const yearsInCompany = Math.floor(
      (currentDate - joiningDate) / (365 * 24 * 60 * 60 * 1000) // Convert ms to years
    );

    // Check eligibility: At least 2 years in the company
    const isEligibleForIncrement =
      yearsInCompany >= 2 &&
      (!lastIncrementDate || // No increment date
        Math.floor(
          (currentDate - lastIncrementDate) / (365 * 24 * 60 * 60 * 1000)
        ) >= 2); // At least 2 years since the last increment

    if (!isEligibleForIncrement) {
      return res.status(400).json({
        message: "Employee is not eligible for a salary increment",
        eligibility: false,
        yearsInCompany,
      });
    }

    // Calculate the new salary (10% increment)

    const updatedSalary = (employee.salary / 100) * 10;
    const newSalary = employee.salary + updatedSalary;

    console.log(updatedSalary);
    // Update the employee's salary and last updated date
    employee.salary = newSalary;
    employee.lastSalaryIncrementDate = currentDate;

    await employee.save();

    res.status(200).json({
      message: "Salary updated successfully",
      eligibility: true,
      yearsInCompany,
      employee,
    });
  } catch (error) {
    console.error("Error updating salary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get employees eligible for increment
const getEligibleEmployees = async (req, res) => {
  try {
    const today = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(today.getFullYear() - 2);

    // Find employees eligible for salary increment
    const employees = await Employee.find({
      date: { $lte: twoYearsAgo },
      $or: [
        { lastSalaryIncrementDate: null },
        { lastSalaryIncrementDate: { $lte: twoYearsAgo } },
      ],
    });

    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching eligible employees:", error);
    res.status(500).json({ message: "Failed to fetch eligible employees" });
  }
};

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

export { getAllEmployees, updateSalaries, getEligibleEmployees };
