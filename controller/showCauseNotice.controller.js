import { Employee } from "../modules/employee_modules.js";

// Controller to store a Show Cause Notice
const createShowCauseNotice = async (req, res) => {
  try {
    const { employeeId, department, reason, selectedEmployee } = req.body; // Get selectedEmployee details

    if (!employeeId || !department || !reason || !selectedEmployee) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the logged-in employee by ID
    const loggedInEmployee = await Employee.findById(employeeId);
    if (!loggedInEmployee) {
      return res.status(404).json({ message: "Logged-in employee not found" });
    }

    // Create a new Show Cause Notice
    const newNotice = {
      department,
      reason,
      status: "Pending", // Default status
      issuedAt: new Date(),
      selectedEmployee: {
        id: selectedEmployee.id,
        name: selectedEmployee.name,
        employeeCode: selectedEmployee.employeeCode,
      },
    };

    // Store notice under the logged-in employee
    loggedInEmployee.showCauseNotices.push(newNotice);
    await loggedInEmployee.save();

    res.status(201).json({
      message: "Show Cause Notice submitted successfully",
      showCauseNotice: newNotice,
    });
  } catch (error) {
    console.error("Error creating Show Cause Notice:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to get all Show Cause Notices for admin review
const getShowCauseNotices = async (req, res) => {
  try {
    const employees = await Employee.find(
      {},
      "firstName lastName department showCauseNotices"
    );

    // Extract all show cause notices with employee details
    const notices = employees.flatMap((emp) =>
      emp.showCauseNotices.map((notice) => ({
        employeeName: `${emp.firstName} ${emp.lastName}`,
        department: emp.department,
        ...notice._doc,
      }))
    );

    res.status(200).json({ showCauseNotices: notices });
  } catch (error) {
    console.error("Error fetching Show Cause Notices:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to update Show Cause Notice status (Admin Review)
const updateShowCauseStatus = async (req, res) => {
  try {
    const { noticeId, status } = req.body;
    console.log(noticeId, status);

    // Check if both noticeId and status are provided
    if (!noticeId || !status) {
      return res
        .status(400)
        .json({ message: "Notice ID and Status are required" });
    }

    // Find the employee who has the showCauseNotice
    const employee = await Employee.findOne({
      "showCauseNotices._id": noticeId,
    });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Find the notice within the employee's showCauseNotices
    const notice = employee.showCauseNotices.id(noticeId);
    if (!notice) {
      return res.status(404).json({ message: "Show Cause Notice not found" });
    }

    // Update the status of the notice
    notice.status = status;
    notice.reviewedAt = new Date();

    // Save the updated employee data
    await employee.save();

    res.status(200).json({ message: "Show Cause Notice updated successfully" });
  } catch (error) {
    console.error("Error updating Show Cause Notice status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createShowCauseNotice, getShowCauseNotices, updateShowCauseStatus };
