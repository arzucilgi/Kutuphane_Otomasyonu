// src/components/ContactInfo.tsx
import { Box, Typography, Divider, Stack, Link } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InstagramIcon from '@mui/icons-material/Instagram';

const ContactInfo = () => {
  return (
    <Box sx={{ py: 6, background: 'radial-gradient(circle, #bbdefb 0%, transparent 70%)', color: '#333' }}>
      {/* Üst çizgi */}
      <Divider sx={{ mb: 4, borderColor: '#ccc' }} />

      {/* Başlık */}
      <Typography
        variant="h5"
        fontWeight="800"
        textAlign="center"
        sx={{    background: 'linear-gradient(90deg, #00c6ff, #0072ff, #6a11cb)',
          WebkitBackgroundClip: 'text',
         WebkitTextFillColor: 'transparent', mb: 4 }}
      >
        İletişim Bilgileri
      </Typography>

      {/* İletişim İçeriği: Yan yana düzen */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        alignItems="flex-start"
        spacing={6}
        sx={{ px: 2, textAlign: 'center', flexWrap: 'wrap' }}
      >
        {/* E-posta */}
        <Box>
          <EmailIcon sx={{ color: '#4375b2ff', fontSize: 30 }} />
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
            E-posta
          </Typography>
          <Link href="mailto:info@kutuphane.com" underline="hover" color="inherit">
            kutuphane@pau.edu.tr
          </Link>
        </Box>

        {/* Telefon */}
        <Box>
          <PhoneIcon sx={{ color: '#4375b2ff', fontSize: 30 }} />
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
            Telefon
          </Typography>
          <Typography variant="body2">+90 258 296 2170</Typography>
        </Box>

        {/* Adres */}
        <Box>
          <LocationOnIcon sx={{ color: '#4375b2ff', fontSize: 30 }} />
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
            Adres
          </Typography>
          <Typography variant="body2">
            Pamukkale Üniversitesi Kütüphane ve Dokümantasyon <br />
            Daire Başkanlığı Kınıklı Kampüsü Denizli 20070
          </Typography>
        </Box>

        {/* Çalışma Saatleri */}
        <Box>
          <AccessTimeIcon sx={{ color: '#4375b2ff', fontSize: 30 }} />
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
            Çalışma Saatleri
          </Typography>
          <Typography variant="body2">
            Hafta içi: 08:30 - 17:30<br />
            Cumartesi: 10:00 - 14:00<br />
            Pazar: Kapalı
          </Typography>
        </Box>

        {/* Instagram */}
        <Box>
          <InstagramIcon sx={{ color: '#4375b2ff', fontSize: 30 }} />
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
            Instagram
          </Typography>
          <Link
            href="https://instagram.com/kutuphane"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="inherit"
          >
            @kutuphane
          </Link>
        </Box>
      </Stack>

      {/* Alt çizgi */}
      <Divider sx={{ mt: 5, borderColor: '#ccc' }} />

      {/* Footer Bilgileri */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Kütüphane Bilgi Sistemi. Tüm hakları saklıdır.
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          <Link href="/gizlilik-politikasi" underline="hover" color="inherit">
            Gizlilik Politikası
          </Link>{' '}
          |{' '}
          <Link href="/kullanim-sartlari" underline="hover" color="inherit">
            Kullanım Şartları
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default ContactInfo;