import React from 'react';
import HeroSection from '../components/LandingPage/HeroSection';
import LibraryAbout from '../components/LandingPage/LibraryAbout';
import LibraryHighlights from '../components/LandingPage/LibraryHighlights';
import { Box, Container } from '@mui/material';
import LibraryFeatures from '../components/LandingPage/LibraryFeatures';
import ContactInfo from '../components/LandingPage/ContactInfo';

const LandingPage: React.FC = () => {
  return (
    <Box sx={{ width: '100%', overflow: 'hidden', background: 'radial-gradient(circle, #bbdefb 0%, transparent 70%)',}}>
      {/* Hero bölümü ekranı tamamen kaplayacak */}
      <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        flexDirection: {
          xs: 'column', // mobilde alt alta
          md: 'column', 
          lg:'row'    // büyük ekranlarda yan yana
        },
        justifyContent: 'center',
        alignItems: 'center',
        // gap: 4,
        // px: 2,
      }}
      >

        <section
        id="home"
        style={{
          width: '80%',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          // color: 'white',
        }}
      >
        <HeroSection />
      </section>
        
       <section id='about'>
           <LibraryHighlights/>
       </section>
       
        
      </Box>

      {/* Diğer içerikler */}
      <Box  sx={{   width:'100%'}}>
        <section id='about'>
              <LibraryAbout />
        </section>
        <section id='about'>
             <LibraryFeatures />
        </section>
        
        <section id='contact'>
             <ContactInfo/>
        </section>
        
      </Box>
    </Box>
  );
};

export default LandingPage;
