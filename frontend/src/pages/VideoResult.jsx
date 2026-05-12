import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const VideoResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // CreateVideo page se hum Video URL bhejenge
  const videoUrl = location.state?.videoUrl;

  // Agar koi bina video banaye direct is page pe aaye, to wapas bhej do
  if (!videoUrl) {
    return (
      <div style={containerStyle}>
        <h2>No Video Found! 😕</h2>
        <button onClick={() => navigate('/dashboard')} style={btnStyle}>Go to Dashboard</button>
      </div>
    );
  }

  // --- DOWNLOAD FUNCTION ---
  const handleDownload = async () => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `my-ai-video-${Date.now()}.mp4`; // File ka naam
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      alert("Downloading Started! 🚀");
    } catch (err) {
      console.error(err);
      alert("Download failed. You can right-click the video and save.");
    }
  };

  return (
    <div style={containerStyle}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={boxStyle}
      >
        <h2 style={headingStyle}>🎉 Your Video is Ready!</h2>
        
        {/* Video Player */}
        <div style={videoWrapperStyle}>
          <video controls autoPlay src={videoUrl} style={videoStyle}></video>
        </div>

        {/* Action Buttons */}
        <div style={buttonGroupStyle}>
          <button onClick={handleDownload} style={downloadBtnStyle}>
            ⬇ Download Video
          </button>
          
          <button onClick={() => navigate('/dashboard')} style={secondaryBtnStyle}>
            Create Another
          </button>
        </div>

      </motion.div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { minHeight: '100vh', background: '#0f0f1a', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'sans-serif' };
const boxStyle = { background: '#1e1e2e', padding: '40px', borderRadius: '20px', width: '90%', maxWidth: '500px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' };
const headingStyle = { marginBottom: '20px', background: 'linear-gradient(to right, #a855f7, #3b82f6)', WebkitBackgroundClip: 'text', color: 'transparent', fontSize: '2rem' };
const videoWrapperStyle = { width: '100%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.5)', marginBottom: '30px', border: '2px solid #333' };
const videoStyle = { width: '100%', display: 'block' };
const buttonGroupStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const btnStyle = { padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' };

const downloadBtnStyle = { 
  width: '100%', padding: '15px', 
  background: 'linear-gradient(to right, #10b981, #3b82f6)', 
  color: 'white', border: 'none', borderRadius: '10px', 
  fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
  transition: 'transform 0.2s'
};

const secondaryBtnStyle = { 
  width: '100%', padding: '15px', 
  background: 'transparent', 
  color: '#aaa', border: '1px solid #444', borderRadius: '10px', 
  fontSize: '1rem', cursor: 'pointer' 
};

export default VideoResult;