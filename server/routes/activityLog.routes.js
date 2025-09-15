import express from "express";
import UserActivityLog from "../models/UserActivityLog.js";

const userActivityRouter = express.Router();

// POST /api/logs
userActivityRouter.post("/", async (req, res) => {
  try {
    const { userId, event, details } = req.body;

    const log = new UserActivityLog({ userId, event, details });
    await log.save();

    res.status(201).json({ message: "Activity logged successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to log activity" });
  }
});

export default userActivityRouter;
