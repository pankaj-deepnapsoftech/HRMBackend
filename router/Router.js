import { Router } from "express";
import {
  userRegister,
  userLogin,
  userLogout,
} from "../controller/user_controller.js";

import {
  employeeLogin,
  employeeLogout,
  employeeRegister,
} from "../controller/employee_controller.js";
import { getAllUser } from "../controller/employee_controller.js";
import {
  projectDetails,
  getAllProject,
  deleteProject,
  updateProject,
} from "../controller/projectController.js";
import { addBackgroundVerification } from "../controller/bgVerificationController.js";
import { addBankVerification } from "../controller/bankVerification_controller.js";
import {
  addRequestLeave,
  getLeaveLimits,
  updateLeaveRequest,
} from "../controller/empLeave_controller.js";
import markAttendance from "../controller/empAttendence_Controller.js";
import { getLeaveStatus } from "../controller/leave_controller.js";
import updateEmployeeLeaveBalance from "../controller/adminLeaves_Increase.js";
// import { getActiveTime, updateActiveTime } from "../controller/empTracking_controller.js";
import {getTotalPresentEmployees,getTotalAbsentEmployees }from "../controller/empTotalPresent_controller.js";
import deleteEmployee from "../controller/empDelete_controller.js";
import getTodayAttendance from "../controller/dailyAttendence.js";
import { requestPasswordReset, resetPassword } from "../controller/requestPasswordReset.js";
import { adminResetPassword, adminRequestPasswordReset} from "../controller/adminRequestPasswordReset.js"
import editEmployeeDetails from "../controller/empEditDetails_controller.js";
import {assets,clearAssignedAssets,fetchAllAssets} from "../controller/assets.controller.js";
import terminateEmployee from "../controller/Terminated_controller.js";
import { getAllEmployees, getEligibleEmployees, updateSalaries } from "../controller/payroll_controller.js";
import { get } from "mongoose";
import { approveAdvanceRequest, getAdvanceRequests, rejectAdvanceRequest, requestAdvance } from "../controller/empAdvancedMoney_controller.js";
import { advancedEligibility, getEligiblityPolicy, updateAdvanceAmount } from "../controller/advanedMoneyEligiblity_controller.js";
import { addNote, deleteNote, getNotes } from "../controller/empNotes_controller.js";
import { gatePassApproval, gatePassRequest, getAllPassRequest } from "../controller/reqGatepass.controller.js";
import { createShowCauseNotice, getShowCauseNotices, updateShowCauseStatus } from "../controller/showCauseNotice.controller.js";
import {upload } from "../middleware/multer.js";
import { addIncentive } from "../controller/incentive_controller.js";
import { addReimbursement } from "../controller/reimbursement_controller.js";
const userRouter = Router();

userRouter.route("/Register").post(userRegister);
// admin user login
userRouter.route("/Login").post(userLogin);
userRouter.route("/logout").post(userLogout);
userRouter.route("/:employeeId/logout").post(employeeLogout);
// routes for update the leave balance
userRouter.route("/employee/requestLeave/update").patch(updateLeaveRequest);
userRouter.route("/update-employee-leave").post(updateEmployeeLeaveBalance);
userRouter.route("/:employeeId/leave/limits").get(getLeaveLimits);
userRouter.route("/:employeeId/request/leave").post(addRequestLeave);
// userRouter.route("/employee/:empId/active/time").get(getActiveTime);
// userRouter.route("/employee/:employeeId/updateActiveTime").post(updateActiveTime)
userRouter.route("/employee/attendance/present/count").get(getTotalPresentEmployees);
userRouter.route("/employee/attendance/absent/count").get(getTotalAbsentEmployees);
userRouter.route("/employee/:employeeId/delete").delete(deleteEmployee);
userRouter.route("/employee/daily/attendance").get(getTodayAttendance);
userRouter.route("/projectDetails/:id").delete(deleteProject);
userRouter.route("/projectDetails/update/:id").put(updateProject);


// routes for reset password
userRouter.route("/reset-password/request").post(requestPasswordReset);
userRouter.route("/reset-password/verify").post(resetPassword);
userRouter.route("/admin/reset-password/request").post(adminRequestPasswordReset);
userRouter.route("/admin/reset-password/verify").post(adminResetPassword);
userRouter.route("/employee/:id").put(editEmployeeDetails);
userRouter.route("/project/delete/:deleteProject}").delete(deleteProject);


// routes for assign the assets
userRouter.route("/assign/assets").post(assets);
userRouter.route("/employeeWithAssets").get(fetchAllAssets)
userRouter.route("/clear/assets").post(clearAssignedAssets)

// routes for terminate the employee
userRouter.route("/terminate/:employeeId").patch(terminateEmployee);

// routes for employee notes
userRouter.route("/employee/:id/notes").post(addNote);
userRouter.route("/get/:id/notes").get(getNotes);
userRouter.route("/delete/:id/:noteId").delete(deleteNote);

// routes for advanced money
userRouter.route("/request/advance/:employeeId").post(requestAdvance);
userRouter.route("/requests/advance/:employeeId").get(getAdvanceRequests);
userRouter.route("/request/advance/approve/:employeeId/:requestId").put(approveAdvanceRequest);
userRouter.route("/request/advance/rejected/:employeeId/:requestId").put(rejectAdvanceRequest);
userRouter.route("/get/advanced/eligiblity").get(getEligiblityPolicy);
userRouter.route("/set/eligibility/policy").post(advancedEligibility);
userRouter.route("/edit/advanced/amount").put(updateAdvanceAmount);


// employee login
userRouter.route("/:employeeId/leaveStatus").get(getLeaveStatus);
userRouter.route("/employee/login").post(employeeLogin);
userRouter.route("/employee/register").post(upload.single("avatar"), employeeRegister);
userRouter.route("/employee/all/registerDetails").post(getAllUser);
userRouter.route("/projectDetails").post(projectDetails);
userRouter.route("/all/projectDetails").post(getAllProject);
userRouter.route("/:employeeId/verify").post(addBackgroundVerification);
userRouter.route("/:employeeId/bankDetails/verify").post(addBankVerification);
userRouter.route("/:employeeId/request/leave").post(addRequestLeave);
userRouter.route("/:employeeId/attendence/details").post(markAttendance);
userRouter.route("/incentive").post(addIncentive);
userRouter.route("/addReimbursement").post(addReimbursement);






//gate pass routes
userRouter.route("/employee/gatepass/request").post(gatePassRequest);
userRouter.route("/employee/gatepass/:employeeId/approve").put(gatePassApproval);
userRouter.route("/employee/gatepass/all/:employeeId").get(getAllPassRequest);

// show-cause-notice-routes
userRouter.route("/showcause/notice").post(createShowCauseNotice);
userRouter.route("/get/showcause/notice").get(getShowCauseNotices);
userRouter.route("/update/showcause/notice/:id").put(updateShowCauseStatus);

export default userRouter;
