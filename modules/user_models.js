import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      unique: true,
    },
  
    contactId: {
      type: String,
      unique: true,
    },
    otp: String,            // Store the generated OTP
    otpExpires: Date,       // Store the expiration time of the OTP
  },
  { timestamps: true }
);

// bcrypt the employee password before saving
userSchema.pre("save", async function (next) {
  // Check if the password field is modified
  if (!this.isModified("password")) return next();

  // Hash the password only if it's not already hashed
  const isAlreadyHashed = this.password.startsWith("$2b$");
  if (!isAlreadyHashed) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

// Function to compare the password
userSchema.methods.isPasswordCorrect = async function (password) {
  if (!password || typeof password !== "string") {
    throw new Error("Invalid password provided for comparison.");
  }
  return await bcrypt.compare(password, this.password);
};


// funtion to generate the access token
// Function to generate the access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email, // Don't store password in the token
    },
    process.env.ACCESS_TOKEN, // Make sure to use a proper secret key
    {
      expiresIn: process.env.EXPIRE_ACCESS_TOKEN, // Set the expiry time
    }
  );
};


// schema for adding the employee leave by admin




export const User = mongoose.model("User", userSchema);
