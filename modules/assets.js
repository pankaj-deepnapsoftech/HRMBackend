import mongoose from "mongoose";

// Define the schema for the Asset
const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Laptop", "Bike", "Mobile", "Headset", "Other"], // Add "Other" here
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the Assets model based on the schema
export const Assets = mongoose.model("Assets", assetSchema);
