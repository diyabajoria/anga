import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const notificationsRouter = express.Router();

notificationsRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ notifications });
  }),
);

notificationsRouter.patch(
  "/:id/read",
  requireAuth,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true },
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json({ notification });
  }),
);

notificationsRouter.patch(
  "/read-all",
  requireAuth,
  asyncHandler(async (req, res) => {
    await Notification.updateMany({ userId: req.user._id }, { read: true });
    res.json({ message: "Notifications marked read" });
  }),
);
