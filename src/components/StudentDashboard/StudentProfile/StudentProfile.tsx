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
    <Box sx={{ Width: "100%", mx: "auto", p: 3, overflow: "auto" }}>
      {/* Flex container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          gap: 3,
          mb: 3,
        }}
      >
        {/* Kullanıcı Bilgileri */}
        <Paper
          sx={{
            flex: isSmallScreen ? "none" : "1 1 40%",
            p: 3,
            minWidth: 280,
            height: "100%",
          }}
          elevation={4}
        >
          <Typography variant="h6" fontWeight="bold" color="#444">
            Bilgilerim
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <UserInfoCard userData={userData} />
        </Paper>

        {/* Okuma İstatistikleri */}
        <Paper
          sx={{
            flex: isSmallScreen ? "none" : "1 1 60%",
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          elevation={4}
        >
          <Typography variant="h6" mb={3} textAlign="center">
            Okuma İstatistiklerim
          </Typography>
          <ReadingStatsChart userId={userData.id} />
        </Paper>
      </Box>

      {/* Kiralanan Kitaplar alt tarafta tam genişlikte */}
      <Paper sx={{ p: 3 }} elevation={4}>
        <Typography variant="h6" mb={2}>
          Kiraladığım Kitaplar
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <RentedBooksTable rentedBooks={rentedBooks} />
      </Paper>
    </Box>
  );
};

export default StudentProfile;
