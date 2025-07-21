import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Fade,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import kutuphaneLogo from '../assets/kütüphane.png'

const Register = () => {
  const [formData, setFormData] = useState({
    ad_soyad: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    // 1. Supabase auth ile kullanıcı oluştur
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          ad_soyad: formData.ad_soyad,
          rol: 'kullanici',
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // 2. Kullanıcı oluşturulduysa kendi 'kullanicilar' tablosuna ekle
    if (data.user) {
      const { error: insertError } = await supabase
        .from('kullanicilar')
        .insert([
          {
            id: data.user.id,  // uuid user id olarak
            ad_soyad: formData.ad_soyad,
            eposta: formData.email,
            rol: 'kullanici',
          },
        ]);

      if (insertError) {
        setErrorMsg('Kayıt başarılı ancak veritabanına eklenirken hata oluştu.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
         background: 'radial-gradient(circle, #bbdefb 0%, transparent 70%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          <Paper
            elevation={10}
            sx={{
              p: 5,
              borderRadius: 4,
              backgroundColor: 'rgba(230, 242, 249, 0.95)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
             {/* Logo ve Başlık */}
            <Box mb={3} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
              <img
                src={kutuphaneLogo}
                alt="Pamukkale Üniversitesi"
                style={{ width: '150px', marginBottom: '10px' }}
              />
              <Typography
                variant="h5"
                fontWeight="bold"
                color="#1a237e"
                gutterBottom
              >
                Pamukkale Üniversitesi
              </Typography>
              <Typography
                variant="h6"
                color="#2a5aa9"
                gutterBottom
              >
                Fuat Sezgin Kütüphanesi Giriş Paneli
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                fullWidth
                label="Ad Soyad"
                name="ad_soyad"
                value={formData.ad_soyad}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiInputLabel-root': { color: '#357ABD' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#357ABD' },
                    '&:hover fieldset': { borderColor: '#2a5aa9' },
                    '&.Mui-focused fieldset': { borderColor: '#1a237e' },
                  },
                }}
              />

              <TextField
                margin="normal"
                fullWidth
                label="E-Posta"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiInputLabel-root': { color: '#357ABD' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#357ABD' },
                    '&:hover fieldset': { borderColor: '#2a5aa9' },
                    '&.Mui-focused fieldset': { borderColor: '#1a237e' },
                  },
                }}
              />

              <TextField
                margin="normal"
                fullWidth
                label="Şifre"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiInputLabel-root': { color: '#357ABD' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#357ABD' },
                    '&:hover fieldset': { borderColor: '#2a5aa9' },
                    '&.Mui-focused fieldset': { borderColor: '#1a237e' },
                  },
                }}
              />

              {errorMsg && (
                <Typography
                  color="error"
                  mt={2}
                  textAlign="center"
                  fontWeight="bold"
                  sx={{ userSelect: 'none' }}
                >
                  {errorMsg}
                </Typography>
              )}

              <Box mt={3} textAlign="center">
                 <Button
                 onClick={()=>navigate('/')}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{
                    borderRadius: '50px',
                    m:2,
                    py: 1.8,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    background:
                      'linear-gradient(45deg, #1a237e 30%, #357ABD 90%)',
                    boxShadow:
                      '0 3px 5px 2px rgba(53, 122, 189, .3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background:
                        'linear-gradient(45deg, #283593 30%, #1a237e 90%)',
                      boxShadow:
                        '0 6px 10px 4px rgba(26, 35, 126, .4)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Ana Ekrana Dön'}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{
                    borderRadius: '50px',
                    px: 6,
                    py: 1.8,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    background:
                      'linear-gradient(45deg, #1a237e 30%, #357ABD 90%)',
                    boxShadow:
                      '0 3px 5px 2px rgba(53, 122, 189, .3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background:
                        'linear-gradient(45deg, #283593 30%, #1a237e 90%)',
                      boxShadow:
                        '0 6px 10px 4px rgba(26, 35, 126, .4)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Kayıt Ol'}
                </Button>
              </Box>

              <Fade in={success}>
                <Typography
                  mt={3}
                  textAlign="center"
                  color="success.main"
                  fontWeight="bold"
                >
                   🎉 Tebrikler! Kütüphane Otomasyonu’na başarıyla kayıt oldunuz. Giriş ekranına yönlendiriliyorsunuz...
                </Typography>
              </Fade>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Register;
