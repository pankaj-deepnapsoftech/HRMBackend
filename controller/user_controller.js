import { User } from "../modules/user_models.js";
import ApiError from "../utlis/ApiError.js";
import ApiResponse from "../utlis/ApiResponse.js";
import jwt from "jsonwebtoken";

// Generate access token function
const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const accessToken = user.generateAccessToken();


    // Ensure that the token is generated before saving
    await user.save({ validateBeforeSave: false });

    return { accessToken };
  } catch (error) {
    // Handle errors gracefully
    throw new ApiError(
      500,
      "Error while generating access token: " + error.message
    );
  }
};

// User Register Controller
const userRegister = async (req, res) => {
  try {
    
    const { username, email, password, firstName, lastName, contactId } =
      req.body;

    if ([username, email, password].some((field) => !field || !field.trim())) {
      throw new ApiError(409, "User details are incomplete.");
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ApiError(409, "User with these details already exists.");
    }

    const user = await User.create({
      username,
      email,
      password,
      contactId,
      firstName,
      lastName,
    });
    
    if (!user) {
      throw new ApiError(500, "User could not be created. Please try again.");
    }

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "User was created but failed to fetch.");
    }

    res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User Registered Successfully"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

// User Login Controller
const userLogin = async (req, res) => {
  try {
    

    const { username, email, password } = req.body;

    if ((!username && !email) || !password?.trim()) {
      throw new ApiError(
        401,
        "Login details are incomplete. Provide either username or email and a password."
      );
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (!existingUser) {
      return res
        .status(401)
        .json({ message: "User with this email does not exist" });
    }

    const isValidPassword = await existingUser.isPasswordCorrect(password);

    if (!isValidPassword) {
      return res
      .status(401)
      .json({ message: "User password is incorrect" });
    }

    const { accessToken } = await generateAccessToken(existingUser._id);

    const userResponse = await User.findById(existingUser._id).select(
      "-password -accessToken"
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure flag for production
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          { userResponse, accessToken },
          "User logged in successfully"
        )
      );
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

// User Logout Controller
const userLogout = async (req, res) => {
  try {
    // Check if the accessToken cookie is already missing (optional, depending on your logic)
    const token = req.cookies.accessToken;
   

    if (!token) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "No active session found"));
    }

    // Clear the accessToken cookie
    res
      .status(200)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensure secure in production
        sameSite: "Strict",
      })
      .json(new ApiResponse(200, null, "User logged out successfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, "Failed to log out user."));
  }
};

export { userRegister, userLogin, userLogout };
