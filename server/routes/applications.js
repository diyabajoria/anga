import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { Application } from "../models/Application.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const applicationsRouter = express.Router();

applicationsRouter.get(
  "/my",
  requireAuth,
  asyncHandler(async (req, res) => {
    const filter =
      req.user.role === "worker" ? { workerId: req.user._id } : { customerId: req.user._id };
    const applications = await Application.find(filter)
      .populate("jobId")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ applications });
  }),
);

applicationsRouter.get(
  "/worker",
  requireAuth,
  asyncHandler(async (req, res) => {
    const applications = await Application.find({ workerId: req.user._id })
      .populate("jobId")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ applications });
  }),
);

applicationsRouter.get(
  "/customer",
  requireAuth,
  asyncHandler(async (req, res) => {
    const applications = await Application.find({ customerId: req.user._id })
      .populate("jobId")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ applications });
  }),
);

applicationsRouter.patch(
  "/:id/status",
  requireAuth,
  asyncHandler(async (req, res) => {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, customerId: req.user._id },
      { status: req.body.status },
      { new: true, runValidators: true },
    );
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json({ application });
  }),
);
