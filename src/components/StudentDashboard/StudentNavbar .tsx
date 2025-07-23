// src/components/StudentNavbar.tsx

import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "../../lib/supabaseClient";
import kutuphaneLogo from "../../assets/kütüphane.png";

const items = [
  { label: "Profilim", icon: "👤", to: "profile" },
  { label: "Kitaplar", icon: "📚", to: "books" },
  { label: "Ödünç Al", icon: "📥", to: "rentBook" },
  { label: "Okuduklarım", icon: "📖", to: "readBooks" },
  { label: "Öneriler", icon: "🌟", to: "recommendations" },
];

const StudentNavbar = () => {
  const session = useSession();
  const navigate = useNavigate();

  const userName =
    session?.user?.user_metadata?.ad_soyad ||
    session?.user?.email?.split("@")[0] ||
    "Öğrenci";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        padding: 2,
        borderBottom: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        {/* Sol kısım: Logo + Başlık + Kullanıcı adı */}
        <Grid>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap={0.3}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <img
                src={kutuphaneLogo}
                alt="Pamukkale Üniversitesi"
                style={{ width: "150px", height: "auto" }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", lineHeight: 1.1 }}
              >
                Pamukkale Prof. Dr. Fuat Sezgin
                <br />
                KÜTÜPHANESİ
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#333", ml: 2, mt: 3 }}
            >
              Merhaba, {userName} 👋
            </Typography>
          </Box>
        </Grid>

        {/* Sağ kısım: Menü kutuları + çıkış */}
        <Grid>
          <Box sx={{ overflowX: "visible" }}>
            <Grid
              container
              spacing={2}
              wrap="wrap"
              alignItems="center"
              justifyContent="center"
            >
              {items.map((item, index) => (
                <Grid key={index}>
                  <Link to={item.to} style={{ textDecoration: "none" }}>
                    <Paper
                      elevation={3}
                      sx={{
                        width: 250,
                        maxWidth: 100,
                        height: 100,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        borderRadius: 2,
                        userSelect: "none",
                        transition: "transform 0.3s ease, boxShadow 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                          cursor: "pointer",
                          backgroundColor: "#69969cff",
                        },
                      }}
                    >
                      <Typography variant="h4">{item.icon}</Typography>
                      <Typography
                        variant="subtitle1"
                        align="center"
                        sx={{ mt: 0.5 }}
                      >
                        {item.label}
                      </Typography>
                    </Paper>
                  </Link>
                </Grid>
              ))}

              {/* Çıkış Kutusu */}
              <Grid>
                <Paper
                  elevation={3}
                  onClick={handleLogout}
                  sx={{
                    width: 250,
                    maxWidth: 100,
                    height: 100,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff0f0",
                    borderRadius: 2,
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "transform 0.3s ease, boxShadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 20px rgba(255,0,0,0.2)",
                      backgroundColor: "#ffe5e5",
                    },
                  }}
                >
                  <Typography variant="h4">🚪</Typography>
                  <Typography
                    variant="subtitle1"
                    align="center"
                    sx={{ mt: 0.5 }}
                  >
                    Çıkış Yap
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentNavbar;
