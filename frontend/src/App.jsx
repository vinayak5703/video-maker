import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import CreateVideo from './pages/CreateVideo';
import VideoResult from './pages/VideoResult'; // <--- IMPORT THIS

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-video" element={<CreateVideo />} />
        
        {/* NEW ROUTE */}
        <Route path="/result" element={<VideoResult />} />
      </Routes>
    </Router>
  );
}

export default App;