import { Employee } from "../modules/employee_modules.js";

//function to get the total number of present employee
const getTotalPresentEmployees = async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Use countDocuments to get the number of employees with "Present" status on today's date
    const presentEmployeeCount = await Employee.countDocuments({
      attendance: {
        $elemMatch: {
          date: today,
          status: "Present", // Check for "Present" status on today's date
        },
      },
    });

    // console.log(presentEmployeeCount); // Log the count of present employees

    // Send the count as a response in JSON format
    return res.json({ presentCount: presentEmployeeCount });
  } catch (error) {
    console.error("Failed to retrieve present employees count:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve present employees count" });
  }
};

// function to get the total number of absent employee
const getTotalAbsentEmployees = async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Use countDocuments to get the number of employees with "Absent" status on today's date
    const absentEmployeeCount = await Employee.countDocuments({
      attendance: {
        $elemMatch: {
          date: today,
          status: "Absent", // Check for "Absent" status on today's date
        },
      },
    });

    // console.log(absentEmployeeCount); // Log the count of absent employees

    // Send the count as a response in JSON format
    return res.json({ absentCount: absentEmployeeCount });
  } catch (error) {
    console.error("Failed to retrieve absent employees count:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve absent employees count" });
  }
};

export { getTotalPresentEmployees, getTotalAbsentEmployees };
