const mongoose = require('mongoose');

const VideoProjectSchema = new mongoose.Schema({
  userId:      { type: String, required: true },
  projectName: { type: String, required: true },
  templateId:  { type: String, required: true }, // e.g., "love-story"
  status:      { type: String, default: "draft" }, // draft, rendering, completed
}, { timestamps: true });

module.exports = mongoose.model('VideoProject', VideoProjectSchema);