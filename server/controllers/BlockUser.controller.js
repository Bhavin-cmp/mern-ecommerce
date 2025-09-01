import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { days } = req.body;

  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not Found",
    });
  }
  if (user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Cannot block an admin user",
    });
  }

  user.blocked = true;
  if (days && Number(days) > 0) {
    user.blockExpires = new Date(
      Date.now() + Number(days) * 24 * 60 * 60 * 1000
    );
  } else {
    user.blockExpires = null; // Permanent block
  }
  await user.save();

  res.json({
    success: true,
    message: `User ${user.userName} blocked successfully`,
    user: user,
    blockExpires: user.blockExpires,
  });
});

// UnBlock user
export const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User Not Found",
    });
  }
  user.blocked = false;
  user.blockExpires = null; // clear block expiration
  await user.save();
  res.json({
    success: true,
    message: `User ${user.userName} unblocked successfully`,
    user: user,
  });
});
