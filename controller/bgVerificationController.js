import { Employee } from "../modules/employee_modules.js";
import ApiError from "../utlis/ApiError.js";
import ApiResponse from "../utlis/ApiResponse.js";

// Add Background Verification Details
const addBackgroundVerification = async (req, res) => {
  const { addhar, pan, driving, voterCard, uan } = req.body; // Background verification data
  const { employeeId } = req.params; // Employee ID from URL

  console.log(`Employee ID: ${employeeId}`);
  console.log("Verification Details:", req.body);

  try {
    // Check if the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    // Add background verification data to the employee
    employee.backgroundVerification = {
      addhar,
      pan,
      driving,
      voterCard,
      uan,
    };

    // Save updated employee data
    const updatedEmployee = await employee.save();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedEmployee,
          "Background verification details added successfully"
        )
      );
  } catch (error) {
    console.error("Error adding background verification:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export { addBackgroundVerification };
