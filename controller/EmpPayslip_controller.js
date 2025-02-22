import { Employee } from "../modules/employee_modules.js";

const EmpPayslip = async (req, res) => {
  try {
    const employee = await Employee.find();
    console.log(employee);

    if (employee) {
      return res.status(401).json({ message: "Emp not found" });
    }
  } catch (error) {
    console.log("Employee not found");
  }
};

export default EmpPayslip;
