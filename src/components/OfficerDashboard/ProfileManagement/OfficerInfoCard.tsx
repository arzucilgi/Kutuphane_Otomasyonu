// src/components/OfficerInfoCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

interface OfficerCardProps {
  name: string;
  surname: string;
  title: string;
  email: string;
  phone: string;
  created_at: string; // Hesap oluşturma veya son giriş zamanı
  onEdit?: () => void;
}

const OfficerInfoCard: React.FC<OfficerCardProps> = ({
  name,
  surname,
  title,
  email,
  phone,
  created_at,
  onEdit,
}) => {
  // Baş harfler
  const initials = `${name.charAt(0)}${surname.charAt(0)}`;

  // Tarihi okunabilir formata çevir
  const formattedDate = new Date(created_at).toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 3,
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ width: 56, height: 56 }}>
            {initials.toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton onClick={onEdit}>
            <EditIcon />
          </IconButton>
        }
        title={
          <Typography variant="h6">
            {name} {surname}
          </Typography>
        }
        subheader={title}
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            gap: 3, // öğeler arası boşluk
            flexWrap: "wrap", // çok uzun olursa alt satıra geçer
            fontSize: "0.875rem", // biraz daha küçük font (body2 default)
            color: "text.secondary",
            alignItems: "center",
            whiteSpace: "nowrap", // satır içi öğeler taşmasın
          }}
        >
          <Typography component="span">
            <strong>E-posta:</strong> {email}
          </Typography>
          <Typography component="span">
            <strong>Telefon:</strong> {phone}
          </Typography>
          <Typography component="span">
            <strong>Oluşturulma:</strong> {formattedDate}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OfficerInfoCard;
