// components/CustomAppBar.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/kütüphane.png';

interface CustomAppBarProps {
  activeSection: string;
}

const menuItems = [
  { label: 'Anasayfa', path: '/', sectionId: 'home' },
  { label: 'Hakkımızda', path: '/about', sectionId: 'about' },
  { label: 'İletişim', path: '/contact', sectionId: 'contact' },
  { label: 'Giriş', path: '/login' }, // login için sectionId yok çünkü ayrı sayfa olabilir
];

const CustomAppBar: React.FC<CustomAppBarProps> = ({ activeSection }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

  const handleMenuClick = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <AppBar
      elevation={10}
      sx={{
        height: isMobile ? '160px' : '160px',
        background: 'linear-gradient(135deg, rgba(230,245,255,0.6), rgba(210,235,255,0.4))',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 4px 20px rgba(0, 128, 255, 0.08)',
        color: '#0b3d91',
        borderRadius: '0 0 24px 24px',
        display: 'flex',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 'inherit', px: 3 }}>
        {/* Sol taraf: logo + yazılar */}
        <Box display="flex" alignItems="center">
          <img
            src={Logo}
            alt="Pamukkale Üniversitesi"
            style={{
              height: '150px',
              width: '150px',
              borderRadius: '50%',
              objectFit: 'contain',
              marginRight: 16,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          />
          <Box>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: isMobile ? '1.2rem' : '1.6rem',
              }}
            >
              Pamukkale Üniversitesi
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: isMobile ? '0.95rem' : '1.1rem',
                color: '#555',
              }}
            >
              Prof. Dr. Fuat Sezgin
              KÜTÜPHANESİ
            </Typography>
          </Box>
        </Box>

        {/* Sağ Menü */}
        {!isMobile ? (
          <Box display="flex" gap={4} alignItems="center">
            {menuItems.map((item) => {
              const isActive = item.sectionId === activeSection;
              return (
                <Typography
                  key={item.label}
                  onClick={() => handleMenuClick(item.path)}
                  sx={{
                    cursor: 'pointer',
                    fontSize: '1.15rem',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#1976d2' : 'inherit',
                    borderBottom: isActive ? '2px solid #1976d2' : 'none',
                    paddingBottom: '4px',
                    transition: 'color 0.3s, border-bottom 0.3s',
                    '&:hover': {
                      color: '#1976d2',
                    },
                  }}
                >
                  {item.label}
                </Typography>
              );
            })}
          </Box>
        ) : (
          <>
            <IconButton color="inherit" edge="end" onClick={toggleDrawer(true)}>
              <MenuIcon sx={{ fontSize: 32 }} />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              <Box
                sx={{
                  width: 270,
                  height: '100%',
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  backdropFilter: 'blur(10px)',
                  p: 2,
                }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  {menuItems.map((item) => {
                    const isActive = item.sectionId === activeSection;
                    return (
                      <>
                        <ListItem
                          key={item.label}
                          onClick={() => handleMenuClick(item.path)}
                          sx={{
                            py: 2,
                            backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                            borderRadius: 1,
                            cursor: 'pointer',
                          }}
                        >
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                              fontFamily: 'Poppins, sans-serif',
                              fontSize: '1.15rem',
                              fontWeight: isActive ? 700 : 500,
                              color: isActive ? '#1976d2' : 'inherit',
                            }}
                          />
                        </ListItem>
                        <Divider sx={{ my: 1 }} />
                      </>
                    );
                  })}
                </List>
              </Box>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
