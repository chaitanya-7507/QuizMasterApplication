import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  timer: { type: Number, required: true, default: 10 } // ✅ store timer in minutes
});

export default mongoose.model('Subject', subjectSchema);
