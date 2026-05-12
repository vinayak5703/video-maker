import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThreeDBackground from '../components/ThreeDBackground';

const LandingPage = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', color: 'white' }}>
      
      {/* 1. The 3D Background */}
      <ThreeDBackground />

      {/* 2. The Content Overlay */}
      <div style={{
        position: 'absolute', 
        top: 0, left: 0, width: '100%', height: '100%', 
        display: 'flex', flexDirection: 'column', 
        justifyContent: 'center', alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.6)' 
      }}>
        
        {/* Animated Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
          style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}
        >
          Next Gen Video SaaS
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5, duration: 1 }}
          style={{ fontSize: '1.5rem', marginBottom: '40px', maxWidth: '600px', textAlign: 'center' }}
        >
          Create, Edit, and Manage your videos with the power of AI.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ delay: 1, type: 'spring' }}
          style={{ display: 'flex', gap: '20px' }}
        >
          <Link to="/login">
            <button style={buttonStyle}>Login</button>
          </Link>
          <Link to="/signup">
            <button style={secondaryButtonStyle}>Get Started</button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

// Styles
const buttonStyle = {
  padding: '15px 40px',
  fontSize: '1.2rem',
  backgroundColor: '#4f46e5',
  color: 'white',
  border: 'none',
  borderRadius: '30px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: 'transparent',
  border: '2px solid white'
};

export default LandingPage;