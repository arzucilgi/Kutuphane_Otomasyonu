// src/components/OfficerInfoCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Stack,
  Divider,
  IconButton,
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
    <Card sx={{ maxWidth: 400, borderRadius: 3, boxShadow: 3 }}>
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
        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>E-posta:</strong> {email}
          </Typography>
          <Typography variant="body2">
            <strong>Telefon:</strong> {phone}
          </Typography>
          <Typography variant="body2">
            <strong>Oluşturulma:</strong> {formattedDate}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OfficerInfoCard;
