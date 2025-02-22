import { Employee } from "../modules/employee_modules.js";

const gatePassRequest = async (req, res) => {
  try {
    const {
      reason,
      logoutTime,
      employeeId,
      totalKm,
      otherReason,
      companyWorkReason,
    } = req.body;
    const paymentPerKm = 5; // ₹5 per km

    // Find employee by ID
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Create the base request data object
    let requestData = {
      reason: reason === "Other" ? otherReason : reason,
      status: "Pending",
      requestedAt: new Date(),
      logoutTime,
    };

    // If reason is "Company Work", include additional details
    if (reason === "Company Work") {
      if (!totalKm || !companyWorkReason) {
        return res
          .status(400)
          .json({ message: "All fields for Company Work are required" });
      }
      requestData.totalKm = totalKm;

      requestData.companyWorkReason = companyWorkReason;
      requestData.paymentPerKm = paymentPerKm;
      requestData.totalPayment = totalKm * paymentPerKm; // Calculate total payment
    }

    // Add the request to the employee's gate pass requests
    employee.gatePassRequests.push(requestData);
    await employee.save();

    res
      .status(201)
      .json({ message: "Gate pass requested successfully", requestData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const gatePassApproval = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { gatePassId, status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const gatePass = employee.gatePassRequests.id(gatePassId);
    if (!gatePass)
      return res.status(404).json({ message: "Gate pass request not found" });

    gatePass.status = status;
    gatePass.approvedAt = new Date();

    await employee.save();

    res.json({
      message: `Gate pass ${status.toLowerCase()} successfully`,
      gatePass,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getAllPassRequest = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.json({ gatePassRequests: employee.gatePassRequests });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export { gatePassRequest, gatePassApproval, getAllPassRequest };
