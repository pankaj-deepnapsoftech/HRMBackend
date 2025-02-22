import mongoose from "mongoose";

const backgroundVerificationSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
    unique: true,
  },
  addhar: {
    type: String,
    required: true,
  },
  pan: {
    type: String,
    required: true,
  },
  driving: {
    type: String,
    required: true,
  },
  voterCard: {
    type: String,
    required: true,
  },
  uan: {
    type: String,
    required: true,
  },
});

export const BackgroundVerification = mongoose.model(
  "BackgroundVerification",
  backgroundVerificationSchema
);

export default BackgroundVerification;
