import { Rule } from "../modules/rule_modules.js";
import ApiError from "../utlis/ApiError.js";
import ApiResponse from "../utlis/ApiResponse.js";

const EmployeeRule = async(req, res) => {
  console.log("Request Body:", req.body);
  const { ruleName, condition, note } = req.body;

  const existingRule = await Rule.findOne({
    ruleName,
  });

  if (existingRule) {
    throw new ApiError(404, "This rule name is already exist");
  }

  const rule = await Rule.create({
    ruleName,
    condition,
    note,
  });

  if (!rule) {
    throw new ApiError(404, "Rule does not added");
  }

  res
    .status(201)
    .json(new ApiResponse(201, { rule }, "Rule created Successfully"));
};

export default EmployeeRule;
