import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import { useSession } from "@supabase/auth-helpers-react";
import { fetchManagerByEmail } from "../../services/ManagerServices/ManagerProfileServices/managerService";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

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
      if (session?.user?.id) {
        try {
          const data = await fetchManagerByEmail(session.user.id);
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
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!manager) {
    return (
      <Typography color="error" align="center" mt={4}>
        Yönetici bilgisi bulunamadı.
      </Typography>
    );
  }

  return (
    <Box display="flex" justifyContent="center" m={6}>
      <Card
        sx={{
          width: 400,
          p: 2,
          borderRadius: 4,
          boxShadow: 4,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Box display="flex" flexDirection="row" alignItems="center" m={2}>
          <Avatar sx={{ bgcolor: "#1976d2", width: 72, height: 72 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" m={2}>
            {manager.ad} {manager.soyad}
          </Typography>
        </Box>

        <Divider />

        <CardContent>
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <EmailIcon color="action" />
              <Typography>{manager.eposta}</Typography>
            </Box>

            {manager.telefon && (
              <Box display="flex" alignItems="center" gap={1}>
                <PhoneIcon color="action" />
                <Typography>{manager.telefon}</Typography>
              </Box>
            )}

            <Box display="flex" alignItems="center" gap={1}>
              <BadgeIcon color="action" />
              <Typography>Rol: {manager.rol}</Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <CalendarMonthIcon color="action" />
              <Typography>
                Oluşturulma:{" "}
                {new Date(manager.olusturulma_tarihi || "").toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ManagerProfile;
