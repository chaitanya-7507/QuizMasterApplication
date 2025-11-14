import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalQuizzes: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  highestScore: { type: Number, default: 0 }
});

export default mongoose.model("Stats", statsSchema);
