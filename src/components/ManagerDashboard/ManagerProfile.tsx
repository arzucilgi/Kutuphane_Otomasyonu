import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useSession } from "@supabase/auth-helpers-react";
import { fetchManagerByEmail } from "../../services/ManagerServices/ManagerProfileServices/managerService";

interface Manager {
  ad: string;
  soyad: string;
  eposta: string;
  telefon?: string;
  rol?: string;
  olusturulma_tarihi?: string;
}

const ManagerProfile: React.FC = () => {
  const session = useSession();
  const [manager, setManager] = useState<Manager | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getManager = async () => {
      if (session?.user?.email) {
        try {
          const data = await fetchManagerByEmail(session.user.email);
          setManager(data);
        } catch (err) {
          console.error("Yönetici bilgisi alınamadı:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    getManager();
  }, [session]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!manager) {
    return <Typography color="error">Yönetici bilgisi bulunamadı.</Typography>;
  }

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", mt: 5 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {manager.ad} {manager.soyad}
        </Typography>
        <Typography variant="body1">📧 {manager.eposta}</Typography>
        {manager.telefon && (
          <Typography variant="body1">📞 {manager.telefon}</Typography>
        )}
        <Typography variant="body1">🧩 Rol: {manager.rol}</Typography>
        <Typography variant="body2" color="text.secondary">
          Oluşturulma:{" "}
          {new Date(manager.olusturulma_tarihi || "").toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ManagerProfile;
