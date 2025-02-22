import nodemailer from "nodemailer";
import crypto from "crypto";
import { User } from "../modules/user_models.js";
import bcrypt from "bcrypt";

const adminRequestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the employee by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    }

    // Generate OTP and expiration time
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes

    // Save OTP and expiration in the database
    user.otp = otp;
   user.otpExpires = otpExpires;
    await user.save();

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Use your SMTP host
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
            <h2 style="color: #4CAF50; text-align: center;">Password Reset Request</h2>
            <p>Dear ${user.username},</p>
            <p>You have requested to reset your password. Please use the OTP below:</p>
            <h3 style="text-align: center; color: #333; font-size: 24px;">${otp}</h3>
            <p style="text-align: center;">This OTP is valid for <strong>10 minutes</strong>.</p>
            <p>If you did not request this, please ignore this email or contact support.</p>
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; text-align: center; color: #aaa;">&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;

    await transporter.sendMail({
      from: `"Deepnap Softech" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: emailTemplate,
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
      replyTo: "support@yourdomain.com", // Set a valid reply-to address
    });

    res.status(200).json({ success: true, message: "OTP sent to email." });
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const adminResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    console.log("Reset password request:", email, otp);

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found." });
    }

    // Validate OTP
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP." });
    }

    // Update the password directly (pre-save hook will handle hashing)
    user.password = newPassword;
   user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export { adminResetPassword, adminRequestPasswordReset };
