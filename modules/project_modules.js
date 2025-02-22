import mongoose from "mongoose";
import { Employee } from "./employee_modules.js";

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
    },
    managerName: {
      type: String,
    },
    selectMember: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee", // assuming "User" is the model name for the members
      },
    ],
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
