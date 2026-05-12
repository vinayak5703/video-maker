import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={dashboardStyle}>
      <div style={backgroundGlow}></div>

      {/* Navbar */}
      <nav style={navStyle}>
        <div style={logoStyle}>
          <span style={{color: '#E50914', fontSize: '2rem'}}>▶</span> VideoAI Studio
        </div>
        <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
      </nav>

      {/* Main Content */}
      <div style={mainContainerStyle}>
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={heroSectionStyle}
        >
          <h1 style={heroTitleStyle}>Turn Photos into <br/> <span style={gradientText}>Cinematic Memories.</span></h1>
          <p style={heroSubtitleStyle}>Select a style, upload photos, and get a professional video in seconds.</p>
        </motion.div>

        {/* Templates Grid */}
        <div style={sectionTitleStyle}>Trending Templates</div>
        
        <div style={gridStyle}>
          
          {/* 1. Love Story */}
          <TemplateCard 
            title="Love Story" 
            desc="Romantic vibes with heart effects."
            image="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80"
            color="#ff4b4b"
            onClick={() => navigate('/create-video')} 
          />

          {/* 2. Birthday Bash (Fixed Image) */}
          <TemplateCard 
            title="Birthday Bash" 
            desc="Party poppers and high energy."
            image="https://images.unsplash.com/photo-1530103862676-de3c9a59af38?w=600&q=80" 
            color="#a855f7"
            onClick={() => navigate('/create-video')}
          />

          {/* 3. Travel Diaries */}
          <TemplateCard 
            title="Travel Diaries" 
            desc="Cinematic travel vlog style."
            image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80"
            color="#3b82f6"
            onClick={() => navigate('/create-video')}
          />

           {/* 4. Friendship Goals */}
           <TemplateCard 
            title="Friendship Goals" 
            desc="For your best friends forever."
            image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80"
            color="#fbbf24"
            onClick={() => navigate('/create-video')}
          />

           {/* 5. Gaming Highlights */}
           <TemplateCard 
            title="Gaming Montage" 
            desc="High octane action cuts."
            image="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80"
            color="#ef4444"
            onClick={() => navigate('/create-video')}
          />

           {/* 6. Professional */}
           <TemplateCard 
            title="Business Promo" 
            desc="Clean and corporate look."
            image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80"
            color="#22c55e"
            onClick={() => navigate('/create-video')}
          />

        </div>
      </div>
    </div>
  );
};

// --- Netflix Style Poster Card ---
const TemplateCard = ({ title, desc, image, color, onClick }) => (
  <motion.div 
    whileHover={{ scale: 1.05, zIndex: 10 }}
    whileTap={{ scale: 0.95 }}
    style={cardContainerStyle}
    onClick={onClick}
  >
    <div style={{ ...imageStyle, backgroundImage: `url(${image})` }}>
      <div style={overlayStyle}></div>
    </div>
    <div style={cardContentStyle}>
      <div style={{...tagStyle, backgroundColor: color}}>AI Generated</div>
      <h3 style={cardTitleStyle}>{title}</h3>
      <p style={cardDescStyle}>{desc}</p>
      <div style={playButtonStyle}>▶ Create Now</div>
    </div>
  </motion.div>
);

// --- CSS STYLES ---
const dashboardStyle = { minHeight: '100vh', width: '100vw', backgroundColor: '#141414', color: 'white', fontFamily: "'Inter', sans-serif", overflowX: 'hidden', position: 'relative' };
const backgroundGlow = { position: 'absolute', top: '-10%', left: '20%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: 0, pointerEvents: 'none' };
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', position: 'fixed', top: 0, left: 0, right: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)', zIndex: 100 };
const logoStyle = { fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', textShadow: '0 0 20px rgba(229,9,20,0.5)' };
const logoutBtnStyle = { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', transition: '0.3s' };
const mainContainerStyle = { padding: '120px 60px 60px 60px', position: 'relative', zIndex: 1 };
const heroSectionStyle = { marginBottom: '60px', maxWidth: '800px' };
const heroTitleStyle = { fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px' };
const gradientText = { background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', color: 'transparent' };
const heroSubtitleStyle = { fontSize: '1.3rem', color: '#b3b3b3', maxWidth: '600px' };
const sectionTitleStyle = { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', paddingLeft: '10px', borderLeft: '4px solid #E50914' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', width: '100%' };
const cardContainerStyle = { height: '450px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', position: 'relative', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)', border: '1px solid #333' };
const imageStyle = { width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s' };
const overlayStyle = { width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)' };
const cardContentStyle = { position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' };
const tagStyle = { fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', marginBottom: '10px', color: 'white', textTransform: 'uppercase' };
const cardTitleStyle = { fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 5px 0' };
const cardDescStyle = { fontSize: '0.9rem', color: '#ccc', margin: 0, marginBottom: '15px' };
const playButtonStyle = { fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', color: 'white', opacity: 0.8 };

export default Dashboard;