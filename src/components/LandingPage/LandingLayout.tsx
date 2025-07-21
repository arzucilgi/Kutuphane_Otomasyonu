import React, { useState, useEffect } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import CustomAppBar from './CustomAppBar';

const LandingLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
  const handleScroll = () => {
    const sections = document.querySelectorAll('section');
    let current = '';
    let closestTop = Number.POSITIVE_INFINITY;

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top >= 0 && top < closestTop) {
        closestTop = top;
        current = section.getAttribute('id') || '';
      }
    });

    setActiveSection(current);
  };

  window.addEventListener('scroll', handleScroll);

  // Sayfa yüklendiğinde ilk aktif section'u ayarla
  handleScroll();

  return () => window.removeEventListener('scroll', handleScroll);
}, []);


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1300,
          width: '100%',
          bgcolor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <CustomAppBar activeSection={activeSection} />
      </Box>

      <Toolbar />

      {/* Sayfa içeriği */}
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default LandingLayout;