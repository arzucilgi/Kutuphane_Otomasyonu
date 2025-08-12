import { useEffect, useState } from "react";
import OfficerInfoCard from "../ProfileManagement/OfficerInfoCard";
import OfficerRecentActivities from "../ProfileManagement/OfficerRecentActivities";
import { Box, CircularProgress, Alert, Paper, Typography } from "@mui/material";
import { getLoggedInOfficer } from "../../../services/officerService";
import {
  fetchRecentBooks,
  fetchRecentRentals,
  fetchRecentStudents,
  fetchRecentReturnedBooks,
  fetchRecentPaidPenalties,
} from "../../../services/officerActivityService.tsx";

interface Officer {
  id: string;
  name: string;
  surname: string;
  title: string;
  email: string;
  phone: string;
  created_at: string;
}

const OfficerProfile = () => {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [recentBooks, setRecentBooks] = useState<any[]>([]);
  const [recentRentals, setRecentRentals] = useState<any[]>([]);
  const [recentReturnedBooks, setRecentReturnedBooks] = useState<any[]>([]);
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [recentPaidPenalties, setRecentPaidPenalties] = useState<any[]>([]); // ceza state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const officerData = await getLoggedInOfficer();
        setOfficer(officerData);

        const books = await fetchRecentBooks(officerData.id);
        const rentals = await fetchRecentRentals(officerData.id);
        const students = await fetchRecentStudents(officerData.id);
        const returnedBooks = await fetchRecentReturnedBooks(officerData.id);
        const paidPenalties = await fetchRecentPaidPenalties(officerData.id); // ceza verisi çek

        setRecentBooks(books);
        setRecentRentals(rentals);
        setRecentStudents(students);
        setRecentReturnedBooks(returnedBooks);
        setRecentPaidPenalties(paidPenalties); // ceza verisini state'e set et
      } catch (err: any) {
        setError(err.message || "Bilinmeyen bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress size={60} />
      </Box>
    );

  if (error)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <Alert severity="error" sx={{ width: "90%", maxWidth: 500 }}>
          {error}
        </Alert>
      </Box>
    );

  if (!officer)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <Alert severity="warning" sx={{ width: "90%", maxWidth: 500 }}>
          Memur bilgisi bulunamadı.
        </Alert>
      </Box>
    );

  return (
    <Box
      sx={{
        maxWidth: "95%",
        mx: "auto",
        mt: 6,
        px: 3,
        pb: 6,
        display: "flex",
        flexDirection: "column",
        gap: 5,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          mb={3}
          color="primary.main"
          textAlign={{ xs: "center", md: "center", lg: "left" }}
        >
          Memur Profili
        </Typography>
        <OfficerInfoCard
          {...officer}
          onEdit={() => alert("Profil düzenleme ekranı açılacak")}
        />
      </Paper>

      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          mb={4}
          color="primary.main"
          textAlign={{ xs: "center", md: "center", lg: "left" }}
        >
          Son Aktiviteler
        </Typography>
        <OfficerRecentActivities
          recentBooks={recentBooks}
          recentRentals={recentRentals}
          recentStudents={recentStudents}
          recentReturnedBooks={recentReturnedBooks}
          recentPaidPenalties={recentPaidPenalties}
        />
      </Paper>
    </Box>
  );
};

export default OfficerProfile;
