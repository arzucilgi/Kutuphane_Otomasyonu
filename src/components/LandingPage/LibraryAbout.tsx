import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion } from 'framer-motion';

const stats = [
  {
    icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
    title: 'Kuruluş Yılı',
    text: '1993',
    color: '#1976d2',
  },
  {
    icon: <BookIcon sx={{ fontSize: 40 }} />,
    title: 'Güncel Kitap Sayısı',
    text: '120.000+ basılı kitap',
    color: '#388e3c',
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    title: 'Öne Çıkan Koleksiyonlar',
    text: 'Fen Bilimleri, Sağlık, Eğitim, Mühendislik ve Sosyal Bilimler',
    color: '#f57c00',
  },
  {
    icon: <PublicIcon sx={{ fontSize: 40 }} />,
    title: 'Dijital Kaynaklar',
    text: 'E-kitaplar, veri tabanları, tez ve dergi arşivleri',
    color: '#6a1b9a',
  },
];

const LibraryAbout: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: 3,
        // py: 8,
        // background: `linear-gradient(135deg, #f0f4ff 0%, #e3f2fd 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Arka Plan Efekti */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          background: 'radial-gradient(circle, #bbdefb 0%, transparent 70%)',
          top: -200,
          left: -200,
          zIndex: 0,
          opacity: 0.5,
        }}
      />

      {/* Başlık */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
       <Typography
  variant="h5"
  fontWeight="900"
  textAlign="center"
  gutterBottom
  sx={{
    background: 'linear-gradient(90deg, #00c6ff, #0072ff, #6a11cb)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '1.5px',
    animation: 'fadeInUp 1s ease-out',
    '@keyframes fadeInUp': {
      '0%': {
        opacity: 0,
        transform: 'translateY(30px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  }}
>
  1993'ten bu yana bilgiye açılan kapınız. <br />
  Araştırma, eğitim ve dijital kaynaklarla
  geleceği birlikte inşa ediyoruz.
</Typography>

        <Typography
          variant="h6"
          textAlign="center"
          sx={{
            maxWidth: 800,
            mx: 'auto',
            color: theme.palette.text.secondary,
            mt: 2,
            fontSize: '1.1rem',
          }}
        >
          {/* 1993'ten bu yana bilgiye açılan kapınız. Araştırma, eğitim ve dijital kaynaklarla
          geleceği birlikte inşa ediyoruz. */}

         <strong>
           PAÜ Fuat Sezgin Kütüphanesi olarak bilgiye açılan kapınız olmanın gururunu yaşıyoruz. Sadece kitaplarla dolu bir alan değil, aynı zamanda bilgiye ulaşmanın, araştırmanın ve düşünsel gelişimin merkezinde yer alan bir buluşma noktasıyız.
          Adını, bilim tarihine ışık tutan değerli akademisyen <strong>Prof. Dr. Fuat Sezgin’den</strong>  alan kütüphanemiz; öğrencilerimize, akademisyenlerimize ve araştırmacılarımıza çağdaş, erişilebilir ve teknolojik imkanlarla donatılmış bir çalışma ortamı sunmaktadır.
         Modern mimarisi, sessiz çalışma alanları, grup çalışma salonları, dijital kaynaklara erişim sağlayan sistemleri ve zengin koleksiyonuyla Fuat Sezgin Kütüphanesi; sadece bir kütüphane değil, aynı zamanda öğrenmenin ve üretmenin kalbidir.
         </strong>
        </Typography>
      </motion.div>

      {/* Kartlar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 4,
          mt: 8,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {stats.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <Box
              sx={{
                width: 260,
                minHeight: 130,
                p: 3,
                borderRadius: 3,
                boxShadow: 4,
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: '0.4s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: `0 8px 24px ${item.color}55`,
                  background: `${item.color}10`,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  // mb: 2,
                  color: item.color,
                }}
              >
                {item.icon}
                <Typography variant="h6" fontWeight="bold">
                  {item.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {item.text}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default LibraryAbout;