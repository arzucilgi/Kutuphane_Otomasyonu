import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  Box,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const RentBookModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<number>(7);
  const [renting, setRenting] = useState(false);

  const today = new Date();
  const returnDate = new Date(today);
  returnDate.setDate(today.getDate() + days);

  const handleSearch = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("kitaplar")
      .select("id, kitap_adi, kapak_url, stok_adedi, yazar(isim)")
      .ilike("kitap_adi", `%${searchTerm}%`)
      .single();
    if (!error && data) setBook(data);
    else setBook(null);
    setLoading(false);
  };

  const handleRent = async () => {
    if (!book || book.stok_adedi <= 0) return;
    setRenting(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { error } = await supabase.from("kiralamalar").insert({
      kullanici_id: user.id,
      kitap_id: book.id,
      son_teslim_tarihi: returnDate,
      aktif: false,
    });

    setRenting(false);
    if (!error) {
      toast.success(
        "Kitap ödünç alma isteğiniz alındı. Onaylandıktan sonra geçerli olacaktır."
      );
      onSuccess?.();
      onClose();
    } else {
      toast.error("Hata: " + error.message);
    }
  };

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setBook(null);
      setDays(7);
      setLoading(false);
      setRenting(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Kitap Ödünç Alma</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2}>
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="#f5f5f5"
            p={1}
          >
            <Box
              component="img"
              src={
                book?.kapak_url ||
                "https://via.placeholder.com/200x300?text=Kitap+Seçilmedi"
              }
              alt={book?.kitap_adi || "Kitap"}
              sx={{
                width: "100%",
                maxWidth: 200,
                maxHeight: 300,
                objectFit: "cover",
              }}
            />
          </Box>
          <Box flex={2} display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              label="Kitap adı, yazar veya barkod"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading || renting}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading || renting || !searchTerm.trim()}
            >
              {loading ? <CircularProgress size={24} /> : "Kitabı Bul"}
            </Button>

            {book && (
              <>
                <Typography variant="subtitle1">{book.kitap_adi}</Typography>
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
                    endAdornment: (
                      <InputAdornment position="end">gün</InputAdornment>
                    ),
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
              </>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={renting}>
          İptal
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRent}
          disabled={!book || book.stok_adedi <= 0 || renting}
        >
          {renting ? "İşleniyor..." : "Ödünç Al"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RentBookModal;
