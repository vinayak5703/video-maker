import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { uploadMedia } from '../api/video'; 

const CreateVideo = () => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const navigate = useNavigate();

  const handleAIEnhance = () => {
    if (!text) return alert("Type a message first!");
    const templates = [
      `✨ ${text} - Moments required forever.`,
      `🎬 ${text} - A cinematic journey.`,
      `💖 ${text} - Wishing you magic!`,
    ];
    setText(templates[Math.floor(Math.random() * templates.length)]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) return alert("Max 10 photos!");
    setImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) return alert("Max 3 videos!");
    setVideos(files);
  };

  const handleGenerate = async () => {
    if (images.length === 0 && videos.length === 0) return alert("Upload media first!");
    setLoading(true);
    
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 4000);

    const formData = new FormData();
    formData.append('text', text);
    for (let i = 0; i < images.length; i++) formData.append('images', images[i]);
    for (let i = 0; i < videos.length; i++) formData.append('videos', videos[i]);

    try {
      const data = await uploadMedia(formData);
      clearInterval(interval);
      navigate('/result', { state: { videoUrl: data.videoUrl } });
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Failed! Check Backend Console.");
      setLoading(false);
      clearInterval(interval);
    }
  };

  const loadingTexts = ["🚀 Uploading...", "🎨 Analyzing...", "🎬 Rendering...", "✨ Finalizing..."];

  return (
    <div style={styles.pageContainer}>
      {/* Left Form */}
      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={styles.leftSection}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>← Back</button>
        <h1 style={styles.mainHeading}>Create Magic 🪄</h1>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Message</label>
          <div style={{position: 'relative'}}>
            <input type="text" placeholder="Happy Birthday!" value={text} onChange={(e)=>setText(e.target.value)} style={styles.modernInput} />
            <button onClick={handleAIEnhance} style={styles.aiButton}>✨ AI</button>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Photos ({images.length}/10)</label>
          <label style={styles.uploadBox}>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{display:'none'}} />
            {imagePreviews.length > 0 ? (
               <div style={{display:'flex', gap:'5px', overflowX:'auto', maxWidth:'100%'}}>
                 {imagePreviews.map((src, i) => <img key={i} src={src} style={{width:'50px', height:'50px', borderRadius:'5px'}} />)}
               </div>
            ) : <span style={{color:'#ccc'}}>📸 Select Photos</span>}
          </label>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Videos ({videos.length}/3)</label>
          <label style={styles.uploadBox}>
            <input type="file" multiple accept="video/*" onChange={handleVideoChange} style={{display:'none'}} />
            <span style={{color:'#ccc'}}>🎥 Select Clips</span>
          </label>
        </div>

        <button onClick={handleGenerate} style={styles.generateBtn} disabled={loading}>
          {loading ? `⏳ ${loadingTexts[loadingStep]}` : "✨ Generate Video"}
        </button>
      </motion.div>

      {/* Right Image (Hidden on Mobile via internal logic if needed, but keeping simple here) */}
      <div style={styles.rightSection}>
        <div style={styles.overlay}>
           <h1 style={{fontSize:'3.5rem', fontWeight:'bold'}}>AI Studio</h1>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: { display: 'flex', height: '100vh', width: '100vw', background: '#0f0f1a', color: 'white', fontFamily: 'sans-serif', overflow: 'hidden', position: 'fixed', top:0, left:0 },
  leftSection: { flex: 1, padding: '40px', background: '#0f0f1a', maxWidth: '600px', overflowY: 'auto' },
  rightSection: { flex: 1.5, backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  overlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0f0f1a, transparent)', display: 'flex', alignItems: 'center', paddingLeft: '80px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', color: '#ccc' },
  modernInput: { width: '100%', padding: '15px', borderRadius: '10px', background: '#1a1a2e', border: '1px solid #333', color: 'white' },
  aiButton: { position: 'absolute', right: '5px', top: '5px', bottom: '5px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', padding: '0 15px', cursor: 'pointer' },
  uploadBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', border: '2px dashed #444', borderRadius: '10px', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' },
  generateBtn: { width: '100%', padding: '15px', background: 'linear-gradient(to right, #4f46e5, #9333ea)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  backButton: { background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', marginBottom: '20px' },
  mainHeading: { fontSize: '2.5rem', marginBottom: '20px', background: 'linear-gradient(to right, #fff, #aaa)', WebkitBackgroundClip: 'text', color: 'transparent' }
};

export default CreateVideo;