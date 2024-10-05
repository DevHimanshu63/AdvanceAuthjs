import User from "../model/User.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { verificationToken } from "../utils/generateVarificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenandSetCookie.js";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendwelcomeEmail,
  sendResetSuccessEmail
} from "../mailtrap/emails.js";

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    if (!email || !password || !name) {
      throw new Error(`All fields must be required`);
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({
          message: `User with this email already exists`,
          success: false,
        });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationTokencode = verificationToken();
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      verificationToken: verificationTokencode,
      verificationTokenExpiresAt: Date.now() + 3600000, // 1 hour
    });
    await newUser.save();
    //jwt generate token and set cookie
    generateTokenAndSetCookie(res, newUser._id);
    await sendVerificationEmail(
      newUser.email,
      newUser.name,
      verificationTokencode
    );
    return res.status(200).json({
      message: `user created successfully`,
      success: true,
      user: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyEmail = async (req, res) => {
  const { code } = req.body;
  console.log("code-------->", req.body);
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      res.status(404).json({ message: "Invalid verification code" });
    }
    user.isVarified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendwelcomeEmail(user.email, user.name);
    res
      .status(200)
      .json({
        message: "Email verified successfully",
        success: true,
        user: { ...user._doc, password: undefined },
      });
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();
    res
      .status(200)
      .json({
        message: "Logged in successfully",
        success: true,
        user: { ...user._doc, password: undefined },
      });
  } catch (err) {
    console.log(err);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res
      .status(200)
      .json({ message: "Reset password email link sent successfully" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error occurred while resetting password" });
  }
};

const resetPassword = async (req, res) => {
    const {token} = req.params;
    const { password } = req.body;
  try {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: Date.now() },
    });
    console.log(user);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(password , 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await sendResetSuccessEmail(user.email)
    
    res.status(200).json({ message: "password updated" , success: true});

    } catch (err) {}
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "logout successful" });
};

export { signup, login, logout, verifyEmail, forgotPassword, resetPassword };
