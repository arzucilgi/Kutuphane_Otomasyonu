import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { supabase } from "../../lib/supabaseClient";
import { rentBook } from "../../services/RentBookService";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RentBookPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const kitapFromState = location.state?.kitap || null;

  const [book] = useState<any>(kitapFromState);
  const [days, setDays] = useState<number>(7);
  const [renting, setRenting] = useState(false);

  const today = new Date();
  const returnDate = new Date(today);
  returnDate.setDate(today.getDate() + days);

  const handleRent = async () => {
    if (!book || book.stok_adedi <= 0) return;
    setRenting(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Kullanıcı bulunamadı");

      await rentBook(user.id, book.id, returnDate);
      toast.success("Kitap başarıyla ödünç alındı.");
      navigate("/studentDashboard/books");
    } catch (error: any) {
      alert("Hata: " + error.message);
      toast.error("Kiralama hatası:", error);
    }
    setRenting(false);
  };

  if (!book) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Kitap bilgisi bulunamadı.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 5,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          boxShadow: 3,
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        {/* Left - Image */}
        <Box
          sx={{
            flex: 1,
            minHeight: 400,
            backgroundColor: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Box
            component="img"
            src={
              book?.kapak_url ||
              "https://i.pinimg.com/1200x/8b/a3/e8/8ba3e8db1c2d267e43bfa021c0fa3d9a.jpg"
            }
            alt={book?.kitap_adi || "Kitap"}
            sx={{
              width: "100%",
              maxWidth: 250,
              maxHeight: 350,
              objectFit: "cover",
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Right - Form */}
        <Box
          sx={{
            flex: 2,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Kitap Ödünç Alma
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            {book.kitap_adi}
          </Typography>
          <Typography variant="body2">
            Yazar: {book.yazar?.isim ?? "Bilinmiyor"}
          </Typography>
          <Typography variant="body2">Stok: {book.stok_adedi}</Typography>

          <TextField
            label="Kaç günlüğüne?"
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            inputProps={{ min: 1, max: 30 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">gün</InputAdornment>,
            }}
          />

          <Typography>
            Son Teslim Tarihi:{" "}
            <strong>
              {returnDate.toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </strong>
          </Typography>

          <Button
            variant="contained"
            color="primary"
            disabled={book.stok_adedi <= 0 || renting}
            onClick={handleRent}
          >
            {renting ? "İşleniyor..." : "Ödünç Al"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RentBookPage;
