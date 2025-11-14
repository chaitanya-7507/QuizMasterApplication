import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  questionText: { type: String, required: true },
  options: {
    a: { type: String, required: true },
    b: { type: String, required: true },
    c: { type: String, required: true },
    d: { type: String, required: true }
  },
  correctAnswer: { type: String, required: true }
});

export default mongoose.model("Question", questionSchema);
