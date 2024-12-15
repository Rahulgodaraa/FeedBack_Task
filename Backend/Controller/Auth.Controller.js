import User from "../Model/User.Schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Login controller
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
        success: false,
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Send response
    res.json({
      message: "Login successful",
      success: true,
      userData: {
        _id: user._id, // Make sure this is included
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token: token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Register controller
export const Register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body.userData;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        success: false,
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful",
      success: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Logout controller
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Logout successful",
    success: true,
  });
};
