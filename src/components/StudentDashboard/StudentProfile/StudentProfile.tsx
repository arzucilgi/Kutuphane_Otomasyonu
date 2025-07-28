import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Divider,
  useMediaQuery,
  useTheme,
  Modal,
  IconButton,
} from "@mui/material";
import {
  fetchLoggedInUserProfile,
  fetchBooksRentedByUser,
} from "../../../services/userService";
import UserInfoCard from "../StudentProfile/UserInfoCard";
import RentedBooksTable from "../StudentProfile/RentedBooksTable";
import ReadingStatsChart from "./ReadingStatsChart";
import WeeklyTopBooksTable from "./WeeklyTopBooksTable";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const StudentProfile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [rentedBooks, setRentedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

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

  // Kullanıcı güncellendiğinde userData state'ini yenile
  const handleUserUpdate = (updatedUser: any) => {
    setUserData(updatedUser);
  };

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
        my: 2,
        px: isSmallScreen ? 2 : 4,
      }}
    >
      {/* Kullanıcı Bilgileri Butonu */}
      <Box
        display="flex"
        justifyContent="flex-end"
        mb={2}
        mt={0}
        sx={{
          fontSize: 40,
          "& .MuiIconButton-root": {
            fontSize: 48,
            backgroundColor: "#e3f2fd",
            borderRadius: "50%",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 8px rgba(25, 118, 210, 0.3)",
            "&:hover": {
              backgroundColor: "#90caf9",
              transform: "scale(1.1)",
              boxShadow: "0 6px 12px rgba(25, 118, 210, 0.6)",
            },
          },
        }}
      >
        <IconButton onClick={() => setOpenModal(true)} color="primary">
          <AccountCircleIcon fontSize="inherit" />
        </IconButton>
      </Box>

      {/* Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 3,
            p: 4,
            width: 500,
            height: 600,
            maxWidth: "90%",
            outline: "none",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
            textAlign="center"
            color="primary"
          >
            Kullanıcı Bilgileri
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {/* Güncelleme callback'i ile UserInfoCard */}
          <UserInfoCard userData={userData} onUpdate={handleUserUpdate} />
        </Box>
      </Modal>

      {/* İstatistik ve tablolar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          gap: 4,
          mb: 4,
          alignItems: "stretch",
          minHeight: isSmallScreen ? "auto" : 600,
        }}
      >
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
          <ReadingStatsChart userId={userData.id} />
        </Paper>
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
          <WeeklyTopBooksTable />
        </Paper>
      </Box>

      {/* Kiralanan Kitaplar */}
      <Paper
        elevation={4}
        sx={{
          p: 3,
          mt: isSmallScreen ? 2 : 0,
          maxHeight: isSmallScreen ? "auto" : 800,
          maxWidth: isSmallScreen ? "auto" : 1200,
          overflowY: "auto",
          overflowX: "auto",
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
