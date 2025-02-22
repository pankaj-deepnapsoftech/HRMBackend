import { Employee } from "../modules/employee_modules.js";

const editEmployeeDetails = async (req, res) => {
  const { id } = req.params;
  const { firstName, email, location, department, role } = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { firstName, email, location, department, role },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
};



export default editEmployeeDetails;
