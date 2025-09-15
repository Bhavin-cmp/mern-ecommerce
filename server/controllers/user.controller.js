import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { userName, fullName, email, password, dob } = req.body;
    const profileImage = req.file ? req.file.path : "";
    // console.log("request data", profileImage);

    if (!profileImage) {
      return res.status(400).json({
        success: false,
        message: "Image required for profile",
      });
    }

    const requiredFields = ["userName", "fullName", "email", "password", "dob"];

    //Checking required field
    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    //Check if user already exist using Email and userName
    const userExist = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already available with this email or username",
      });
    }

    // Add avatar upload code here

    const newUser = await User.create({
      userName,
      fullName,
      email,
      password,
      dob,
      profileImage,
    });

    const createdUser = await User.findById(newUser._id).select(" -password");

    if (!createdUser) {
      return res.status(400).json({
        success: false,
        message: "User not created",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User Created Successfully,",
      user: createdUser,
    });
  } catch (error) {
    console.log(`Error while Registering User ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error Occured While user registering",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    //Checking required field
    if (!userName || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or UserName and password are require",
      });
    }

    // const isEmail = emailOrUserName.includes("@");

    // Find the user based on provided email or userName
    const user = await User.findOne({ userName });
    /* const user = await User.findOne(
      isEmail ? { email: emailOrUserName } : { userName: emailOrUserName }
    ); */

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User With this email or userName is not available",
      });
    }

    // Check if user is blocked
    if (user.blocked) {
      //if temporary block, check expiry
      if (user.blockExpires && user.blockExpires < new Date()) {
        // Block expired, unblock user
        user.blocked = false;
        user.blockExpires = null;
        await user.save();
      } else {
        //still blocked
        return res.status(403).json({
          success: false,
          message: "User is blocked, please try after some time",
        });
      }
    }

    const isPasswordValid = await user.isValidPassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid userName Or Password please try again",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).json({
      success: true,
      message: "Login Successfull",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        FullName: user.fullName,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log(`Error while Logging In User ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error Occured While user Logging In",
      error: error.message,
    });
  }
};

export const fetchAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      users,
    });
  } catch (error) {
    console.log("Error while fetcghing all user data");
    return res.status(500).json({
      success: false,
      message: "Error occured while fetchig user data",
      error: error.message,
    });
  }
};

// Fetch user by id
export const fetchUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required to fetch user data",
      });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user Not found with this ID",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User Data fetched Successfully",
      user,
    });
  } catch (error) {
    console.log("Error while fetching user by id", error.message);
    return res.status(500).json({
      success: false,
      message: "Error occured while fetching user by id",
      error: error.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { fullName, email, dob, profileImage } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is requirede to update user profile",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not found using this ID",
      });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.dob = dob || user.dob;
    user.profileImage = profileImage || user.profileImage;

    const updatedUser = await user.save();
    return res.status(200).json({
      success: true,
      message: "user Profile Update Successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error while updating user profile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error while updating user profile",
      error: error,
    });
  }
};
