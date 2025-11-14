import express from "express";
import User from "../models/User.js";
const router = express.Router();

// ✅ Get all participants (for admin dashboard)
router.get("/", async (req, res) => {
  try {
    const participants = await User.find({ role: "Participant" }).select("-password");
    res.json(participants);
  } catch (err) {
    res.status(500).json({ message: "Error fetching participants", error: err.message });
  }
});

// ✅ Delete a participant
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Participant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting participant", error: err.message });
  }
});

export default router;
