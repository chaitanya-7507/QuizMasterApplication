// routes/resultRoutes.js
import express from "express";
import Result from "../models/Result.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Save a quiz result
router.post("/", async (req, res) => {
  try {
    const { userId, subjectId, score, total, percentage } = req.body;

    if (!userId || !subjectId)
      return res.status(400).json({ message: "Missing userId or subjectId" });

    // ✅ Save result
    const result = await Result.create({ userId, subjectId, score, total, percentage });

    // ✅ Update user stats
    const results = await Result.find({ userId });
    const totalQuizzes = results.length;
    const averageScore =
      results.reduce((acc, r) => acc + r.percentage, 0) / totalQuizzes;
    const highestScore = Math.max(...results.map((r) => r.percentage));

    await User.findByIdAndUpdate(userId, {
      stats: { totalQuizzes, averageScore, highestScore },
    });

    res.status(201).json({ message: "✅ Result saved successfully", result });
  } catch (err) {
    console.error("❌ Error saving result:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
