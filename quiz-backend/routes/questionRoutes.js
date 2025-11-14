import express from "express";
import Question from "../models/Question.js";
import Subject from "../models/Subject.js";
const router = express.Router();

// Add question
router.post("/", async (req, res) => {
  try {
    const { subject, questionText, options, correctAnswer } = req.body;

    const foundSubject = await Subject.findById(subject);
    if (!foundSubject) return res.status(404).json({ message: "Subject not found" });

    const question = new Question({
      subject,
      questionText,
      options,
      correctAnswer
    });

    await question.save();
    res.json({ message: "Question added", question });
  } catch (err) {
    res.status(500).json({ message: "Error adding question", error: err.message });
  }
});

// Get all questions
router.get("/", async (req, res) => {
  const questions = await Question.find().populate("subject", "name");
  res.json(questions);
});
// Update question
router.put("/:id", async (req, res) => {
  try {
    const { questionText, options, correctAnswer, subject } = req.body;
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      { questionText, options, correctAnswer, subject },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question updated successfully", updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating question", error: err.message });
  }
});

// Delete question
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting question", error: err.message });
  }
});

export default router;


