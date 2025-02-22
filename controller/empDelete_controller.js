import { Employee } from "../modules/employee_modules.js";


const deleteEmployee = async (req, res) => {
    try {
      const { employeeId } = req.params; // Get employeeId from request params
  
  
      // Find and delete the employee by their ID
      const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
      if (!deletedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      res.status(200).json({
        message: "Employee deleted successfully",
        deletedEmployee,
      });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

  export default deleteEmployee;