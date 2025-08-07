import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "../../lib/supabaseClient";
import kutuphaneLogo from "../../assets/kütüphane.png";

import PersonIcon from "@mui/icons-material/Person";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks"; // Kitap işlemleri
import PeopleIcon from "@mui/icons-material/People"; // Öğrenciler
import HistoryEduIcon from "@mui/icons-material/HistoryEdu"; // Kiralama geçmişi
import QueryStatsIcon from "@mui/icons-material/QueryStats"; // Raporlar
import BarChartIcon from "@mui/icons-material/BarChart"; // İstatistik

const items = [
  {
    label: "Profilim",
    icon: <PersonIcon sx={{ fontSize: "30px", color: "black" }} />,
    to: "profile",
  },
  {
    label: "Kitap Yönetimi",
    icon: <LibraryBooksIcon sx={{ fontSize: "30px", color: "black" }} />,
    to: "book-management",
  },
  {
    label: "Öğrenci İşlemleri",
    icon: <PeopleIcon sx={{ fontSize: "30px", color: "black" }} />,
    to: "students",
  },
  {
    label: "Kiralama İşlemleri",
    icon: <HistoryEduIcon sx={{ fontSize: "30px", color: "black" }} />,
    to: "/officerDashboard/rental-history",
  },
  // {
  //   label: "Ceza İşlemleri",
  //   icon: <WarningAmberIcon sx={{ fontSize: "30px", color: "black" }} />,
  //   to: "penalty-operations",
  // },
  //   {
  //     label: "Öğrenciye Mesaj",
  //     icon: <ChatIcon sx={{ fontSize: "30px", color: "black" }} />,
  //     to: "send-message",
  //   },
  //   {
  //     label: "Kitap Kirala",
  //     icon: <ShoppingCartIcon sx={{ fontSize: "30px", color: "black" }} />,
  //     to: "rent-book",
  //   },
  // {
  //   label: "Kitap İade",
  //   icon: <AssignmentReturnIcon sx={{ fontSize: "30px", color: "black" }} />,
  //   to: "return-book",
  // },
  // {
  //   label: "Kiralama Takibi",
  //   icon: <ManageHistoryIcon sx={{ fontSize: "30px", color: "black" }} />,
  //   to: "rental-tracking",
  // },
  {
    label: "Raporlar",
    icon: <QueryStatsIcon sx={{ fontSize: "30px", color: "black" }} />,
    to: "reports",
  },
  {
    label: "İstatistikler",
    icon: <BarChartIcon sx={{ fontSize: "30px", color: "black" }} />,
    to: "statistics",
  },
  //   {
  //     label: "Kullanıcı Girişleri",
  //     icon: (
  //       <SupervisedUserCircleIcon sx={{ fontSize: "30px", color: "black" }} />
  //     ),
  //     to: "user-logs",
  //   },
];

const OfficerNavbar = () => {
  const session = useSession();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const userName =
    session?.user?.user_metadata?.ad_soyad ||
    session?.user?.email?.split("@")[0] ||
    "Memur";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const MenuGrid = () => (
    <Grid container spacing={2} justifyContent="center" mt={1}>
      {items.map((item, index) => (
        <Grid key={index}>
          <Link to={item.to} style={{ textDecoration: "none" }}>
            <Paper
              elevation={6}
              sx={{
                width: 120,
                height: 100,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.06)",
                  background: "linear-gradient(145deg, #cddcfe, #eaf0ff)",
                  color: "#1a237e",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                  cursor: "pointer",
                },
              }}
            >
              <Typography variant="h4">{item.icon}</Typography>
              <Typography
                variant="subtitle2"
                align="center"
                whiteSpace={"nowrap"}
                sx={{ fontWeight: 500 }}
              >
                {item.label}
              </Typography>
            </Paper>
          </Link>
        </Grid>
      ))}
      {/* Çıkış */}
      <Grid>
        <Paper
          elevation={6}
          onClick={handleLogout}
          sx={{
            width: 100,
            height: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(145deg, #ffe5e5, #fff0f0)",
            borderRadius: 3,
            transition: "all 0.3s ease",
            cursor: "pointer",
            "&:hover": {
              transform: "scale(1.06)",
              background: "linear-gradient(145deg, #ffcccc, #ffe0e0)",
              color: "#b71c1c",
              boxShadow: "0 6px 20px rgba(255,0,0,0.2)",
            },
          }}
        >
          <Typography variant="h4">🚪</Typography>
          <Typography
            variant="subtitle2"
            align="center"
            sx={{ fontWeight: 500 }}
          >
            Çıkış
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <>
      {/* Navbar Üst */}
      <Box
        sx={{
          background: "linear-gradient(to right, #e3f2fd, #f5f5f5)",
          px: 2,
          py: { xs: 1, sm: 2 },
          borderBottom: "1px solid #ccc",
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          flexWrap="nowrap"
        >
          {/* Logo ve Başlık */}
          <Box display="flex" alignItems="center" gap={2}>
            <img
              src={kutuphaneLogo}
              alt="Pamukkale Üniversitesi"
              style={{ width: "150px", height: "auto" }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  lineHeight: 1.5,
                  color: "#0d47a1",
                  fontSize: 20,
                }}
              >
                Pamukkale Üniversitesi <br />
                Prof. Dr. Fuat Sezgin <br />
                KÜTÜPHANESİ
              </Typography>
              <Typography sx={{ fontSize: 18, color: "#555", mt: 0.5 }}>
                Merhaba, <strong>{userName}</strong> 👋
              </Typography>
            </Box>
          </Box>

          {/* Menü */}
          {isMobile ? (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon fontSize="large" sx={{ color: "#0d47a1" }} />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>{MenuGrid()}</Box>
          )}
        </Grid>
      </Box>

      {/* Drawer (mobil) */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            width: 300,
            p: 3,
            background: "#f0f4ff",
            height: "100%",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: "#1a237e",
              fontWeight: "bold",
              textAlign: "center",
              mb: 2,
            }}
          >
            📖 Menü
          </Typography>
          {MenuGrid()}
        </Box>
      </Drawer>
    </>
  );
};

export default OfficerNavbar;
