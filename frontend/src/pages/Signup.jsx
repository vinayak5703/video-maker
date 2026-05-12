import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // connecting to your backend
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Account Created Successfully!');
      navigate('/login'); // Send them to login page
    } catch (err) {
      console.error(err);
      alert('Error creating account. Make sure Backend is running!');
    }
  };

  return (
    <div style={containerStyle}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        style={formBoxStyle}
      >
        <h2 style={{ marginBottom: '20px', color: '#4f46e5' }}>Create Account</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" name="username" placeholder="Username" onChange={handleChange} style={inputStyle} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} style={inputStyle} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} style={inputStyle} required />
          
          <button type="submit" style={buttonStyle}>Sign Up</button>
        </form>

        <p style={{ marginTop: '15px', color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#4f46e5' }}>Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

// Simple Styles
const containerStyle = {
  width: '100vw', height: '100vh', display: 'flex', 
  justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f1a'
};

const formBoxStyle = {
  backgroundColor: 'white', padding: '40px', borderRadius: '15px', 
  textAlign: 'center', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
};

const inputStyle = {
  padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem'
};

const buttonStyle = {
  padding: '12px', backgroundColor: '#4f46e5', color: 'white', 
  border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold'
};

export default Signup;