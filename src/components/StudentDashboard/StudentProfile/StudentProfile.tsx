import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  fetchLoggedInUserProfile,
  fetchBooksRentedByUser,
} from "../../../services/userService";
import UserInfoCard from "../StudentProfile/UserInfoCard";
import RentedBooksTable from "../StudentProfile/RentedBooksTable";
import ReadingStatsChart from "./ReadingStatsChart";

const StudentProfile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [rentedBooks, setRentedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const user = await fetchLoggedInUserProfile();
      setUserData(user);

      if (user) {
        const books = await fetchBooksRentedByUser(user.id);
        setRentedBooks(books || []);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <Typography color="error" variant="h6">
          Kullanıcı bilgileri bulunamadı.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        my: 5,
        px: isSmallScreen ? 2 : 4, // Küçük ekranlarda iç boşluk azaltıldı
      }}
    >
      {/* Üstte kullanıcı bilgileri ve istatistikler yan yana */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          gap: 4,
          mb: 4,
          alignItems: "stretch", // Kutuların aynı yüksekliğe sahip olması için
          minHeight: isSmallScreen ? "auto" : 600, // Küçük ekranlarda yükseklik otomatik
        }}
      >
        {/* Kullanıcı Bilgileri Kutusu */}
        <Paper
          elevation={4}
          sx={{
            flex: 1,
            minWidth: 300,
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxHeight: isSmallScreen ? "none" : 600, // Büyük ekranda sabit yükseklik
          }}
        >
          <UserInfoCard userData={userData} />
        </Paper>

        {/* Okuma İstatistikleri Kutusu */}
        <Paper
          elevation={4}
          sx={{
            flex: 1,
            minWidth: 300,
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxHeight: isSmallScreen ? "none" : 600,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#444"
            mb={2}
            sx={{ display: isSmallScreen ? "block" : "none" }}
          >
            Okuma İstatistikleri
          </Typography>
          <ReadingStatsChart userId={userData.id} />
        </Paper>
      </Box>

      {/* Kiralanan Kitaplar - tam genişlik */}
      <Paper
        elevation={4}
        sx={{
          p: 3,
          mt: isSmallScreen ? 2 : 0, // Küçük ekranlarda üstten boşluk ekle
          maxHeight: isSmallScreen ? "auto" : 400,
          maxWidth: isSmallScreen ? "auto" : 1200,
          overflowY: isSmallScreen ? "auto" : "auto", // Büyük ekranda scroll verilebilir
          overflowX: isSmallScreen ? "auto" : "auto",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
          display={"flex"}
          justifyContent={"center"}
          color="#5da6eeff"
        >
          Kiraladığım Kitaplar
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <RentedBooksTable rentedBooks={rentedBooks} />
      </Paper>
    </Box>
  );
};

export default StudentProfile;
