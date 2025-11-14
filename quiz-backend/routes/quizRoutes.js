import express from 'express';
import mongoose from 'mongoose';
import Question from '../models/Question.js';

const router = express.Router();

// ✅ Get random questions by subject ID
router.get('/:subjectId', async (req, res) => {
  try {
    const subjectId = new mongoose.Types.ObjectId(req.params.subjectId);

    const questions = await Question.aggregate([
      { $match: { subject: subjectId } },
      { $sample: { size: 5 } } // fetch 5 random questions
    ]);

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this subject' });
    }

    res.json(questions);
  } catch (err) {
    console.error('❌ Error fetching quiz questions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
