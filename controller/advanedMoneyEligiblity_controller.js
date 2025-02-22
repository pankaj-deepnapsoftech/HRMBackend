import { Employee } from "../modules/employee_modules.js";

// Update eligibility policy
const advancedEligibility = async (req, res) => {
  try {
    const { advanceEligibilityYears } = req.body;

    if (advanceEligibilityYears < 1) {
      return res
        .status(400)
        .json({ message: "Eligibility years must be at least 1 year." });
    }

    const settings = await Employee.findOneAndUpdate(
      {}, // Assuming a single settings document
      { advanceEligibilityYears },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Advance eligibility policy updated successfully.",
      settings,
    });
  } catch (error) {
    console.error("Error updating eligibility policy:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const getEligiblityPolicy = async (req, res) => {
  try {
    const settings = await Employee.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Settings not found." });
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching eligibility policy:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const updateAdvanceAmount = async (req, res) => {
  const { employeeId, requestId, amount, status } = req.body;

  if (!employeeId || !requestId || amount === undefined || !status) {
    return res.status(400).send({ message: "Missing required fields." });
  }

  try {
    // Find the employee by ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).send({ message: "Employee not found." });
    }

    // Find the specific advance request to update
    const advanceRequest = employee.advanceRequests.id(requestId);

    if (!advanceRequest) {
      return res.status(404).send({ message: "Advance request not found." });
    }
    console.log(advanceRequest);

    // Update the fields of the advance request
    advanceRequest.amount = amount;
    advanceRequest.status = status;
    advanceRequest.responseDate = new Date();

    // Save the updated employee document
    await employee.save();
    console.log(employee);
    res.status(200).send({ message: "Advance request updated successfully." });
  } catch (error) {
    console.error("Error updating advance request:", error);
    res.status(500).send({ message: "Error updating request." });
  }
};

export { advancedEligibility, getEligiblityPolicy, updateAdvanceAmount };
