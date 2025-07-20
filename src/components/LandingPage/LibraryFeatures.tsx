import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { motion, type Variants } from 'framer-motion';

const features = [
  {
    icon: <WifiIcon fontSize="large" color="primary" />,
    title: 'Ücretsiz Yüksek Hızlı Wi-Fi',
    description: 'Kütüphane genelinde kesintisiz ve hızlı internet bağlantısı.',
  },
  {
    icon: <EventAvailableIcon fontSize="large" color="secondary" />,
    title: 'Zengin Sosyal Etkinlikler',
    description: 'Atölyeler, söyleşiler ve öğrenci kulübü faaliyetleriyle dolu bir program.',
  },
  {
    icon: <MeetingRoomIcon fontSize="large" color="success" />,
    title: 'Özel Çalışma Odaları',
    description: 'Bireysel veya grup çalışmaları için sessiz ve konforlu alanlar.',
  },
  {
    icon: <BookOnlineIcon fontSize="large" color="info" />,
    title: 'Online Kitap Rezervasyonu',
    description: 'İstediğiniz kitabı kolayca rezerve edin, zaman kaybetmeyin.',
  },
  {
    icon: <SupportAgentIcon fontSize="large" color="warning" />,
    title: 'Uzman Danışmanlık Hizmeti',
    description: 'Alanında uzman kütüphanecilerden birebir destek alın.',
  },
];

const itemVariants:Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, type: 'spring', stiffness: 60, damping: 15 },
  }),
};

const LibraryFeatures: React.FC = () => {
  return (
    <Box sx={{mb:10}} >
      <Typography
        variant="h5"
        fontWeight="800"
        textAlign="center"
        gutterBottom
        
        sx={{ mb: 6,
    background: 'linear-gradient(90deg, #00c6ff, #0072ff, #6a11cb)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'}}
      >
        Kütüphanemizde Seni Bekleyenler
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid  key={index}>
            <motion.div
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  textAlign: 'center',
                  cursor: 'default',
                  transition: 'transform 0.3s ease',
                  backgroundColor: 'white',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 12px 24px rgba(57, 73, 171, 0.25)',
                  },
                }}
              >
                <Box sx={{ mb: 2, color: '#3949ab' }}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LibraryFeatures;
