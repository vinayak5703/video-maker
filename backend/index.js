const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer'); 
const path = require('path');
const fs = require('fs');

// Import Video Processor
const { createVideo } = require('./videoProcessor'); 

const authRoute = require('./routes/auth');

dotenv.config();
const app = express();

// --- CRITICAL FIX: Increase Body Limit to 2GB ---
app.use(express.json({ limit: '2048mb' })); 
app.use(express.urlencoded({ limit: '2048mb', extended: true }));
app.use(cors());

// Server Timeout Badhao (Processing ke liye)
const server = require('http').createServer(app);
server.timeout = 600000; // 10 Minutes

// Uploads Folder Setup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// --- MULTER STORAGE ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); 
  },
  filename: (req, file, cb) => {
    // Clean Filename (Spaces -> Underscores)
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    cb(null, `${Date.now()}_${cleanName}`);
  },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 * 1024 } // 2GB Limit
});

// Fields Config
const uploadFields = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 3 }
]);

// --- API ROUTE ---
app.post('/api/upload', uploadFields, async (req, res) => {
  try {
    const imageFiles = req.files['images'] ? req.files['images'].map(f => f.path) : [];
    const videoFiles = req.files['videos'] ? req.files['videos'].map(f => f.path) : [];
    const userText = req.body.text || ""; 

    console.log(`📥 Received: ${imageFiles.length} Images, ${videoFiles.length} Videos`);

    if (imageFiles.length === 0 && videoFiles.length === 0) {
      return res.status(400).json({ message: "Upload at least one file!" });
    }

    const outputVideoName = `reels_${Date.now()}.mp4`;

    // Process Video (Wait for completion)
    await createVideo(imageFiles, videoFiles, userText, outputVideoName);

    const videoUrl = `http://localhost:5000/uploads/${outputVideoName}`;
    console.log("✅ Sending Success Response");
    
    res.status(200).json({ 
      success: true, 
      message: "Video Created Successfully", 
      videoUrl: videoUrl 
    });

  } catch (err) {
    console.error("❌ Critical Server Error:", err);
    res.status(500).json({ message: "Video Generation Failed", error: err.message });
  }
});

app.use('/api/auth', authRoute);

// Database Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 High-Performance Server running on PORT ${PORT}`);
});