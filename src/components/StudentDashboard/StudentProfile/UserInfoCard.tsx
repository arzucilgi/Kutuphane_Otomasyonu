import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { getActiveRentalCount } from "../../../services/RentCheckService";

interface Props {
  userData: any;
}

const UserInfoCard: React.FC<Props> = ({ userData }) => {
  // Aktif kiralık kitap sayısını state olarak tut
  const [activeCount, setActiveCount] = useState<number | null>(null);

  useEffect(() => {
    // Asenkron fonksiyonu useEffect içinde çağır
    const fetchActiveCount = async () => {
      const count = await getActiveRentalCount(userData.id);
      setActiveCount(count);
    };

    fetchActiveCount();
  }, [userData.id]);

  return (
    <Card
      sx={{
        width: "70%",
        height: "80%",
        mx: "auto",
        p: 3,
        borderRadius: 5,
        boxShadow: 6,
        background: "linear-gradient(135deg, #ffffff, #f3f7fd)",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="flex-start" mb={2}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: 60,
              height: 60,
              boxShadow: 3,
            }}
          >
            <PersonIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600} color="#333">
              {userData.ad_soyad}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData.eposta}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <CardContent sx={{ px: 0 }}>
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="body1" color="text.secondary">
            <strong>Rol:</strong>{" "}
            <Chip
              label={userData.rol.toUpperCase()}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Typography>

          <Typography variant="body1" color="text.secondary">
            <strong>Ceza Tarihi:</strong>{" "}
            {userData.ceza_tarihi ? (
              <span style={{ color: "#d32f2f", fontWeight: 500 }}>
                {new Date(userData.ceza_tarihi).toLocaleDateString()}
              </span>
            ) : (
              <span style={{ color: "#388e3c", fontWeight: 500 }}>Yok</span>
            )}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            <strong>Aktif Kiralık Kitap:</strong>{" "}
            {activeCount !== null ? activeCount : "Yükleniyor..."}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            <strong>Hesap Oluşturulma Tarihi: </strong>
            {new Date(userData.olusturulma_tarihi).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
