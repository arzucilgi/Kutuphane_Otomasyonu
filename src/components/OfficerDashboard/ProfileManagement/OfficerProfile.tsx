import { useEffect, useState } from "react";
import OfficerInfoCard from "../ProfileManagement/OfficerInfoCard";
import OfficerRecentActivities from "../ProfileManagement/OfficerRecentActivities"; // Yeni komponent
import { Box, CircularProgress, Alert } from "@mui/material";
import { getLoggedInOfficer } from "../../../services/officerService";
import {
  fetchRecentBooks,
  fetchRecentRentals,
  fetchRecentStudents,
} from "../../../services/officerActivityService.tsx"; // Örnek servisler (aşağıda yazabilirim)

interface Officer {
  id: string; // id ekledim ki aktiviteleri çekebilelim
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
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const officerData = await getLoggedInOfficer();
        setOfficer(officerData);

        // Memurun yaptığı son işlemleri çek
        const books = await fetchRecentBooks(officerData.id);
        const rentals = await fetchRecentRentals(officerData.id);
        const students = await fetchRecentStudents(officerData.id);

        setRecentBooks(books);
        setRecentRentals(rentals);
        setRecentStudents(students);
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
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ mt: 4, mx: "auto", maxWidth: 400 }}>
        {error}
      </Alert>
    );

  if (!officer)
    return (
      <Alert severity="warning" sx={{ mt: 4, mx: "auto", maxWidth: 400 }}>
        Memur bilgisi bulunamadı.
      </Alert>
    );

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, px: 2 }}>
      <OfficerInfoCard
        {...officer}
        onEdit={() => alert("Profil düzenleme ekranı açılacak")}
      />

      {/* Aktivite geçmişi */}
      <OfficerRecentActivities
        recentBooks={recentBooks}
        recentRentals={recentRentals}
        recentStudents={recentStudents}
      />
    </Box>
  );
};

export default OfficerProfile;
