import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import { Add } from "@mui/icons-material";

const BookManagement = () => {
  const [open, setOpen] = useState(false);
  const [kitap, setKitap] = useState({
    kitap_adi: "",
    sayfa_sayisi: null,
    stok_adedi: null,
    kapak_url: "",
    ozet: "",
    kategori_id: "",
    yayinevi_id: "",
    yazar_id: "",
    tur_id: "",
    raf_id: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKitap((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // 📌 Supabase’e kayıt işlemi burada olacak
    console.log("Yeni kitap:", kitap);
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
        position: "relative",
      }}
    >
      {/* Kitap Ekle Butonu */}
      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Kitap Ekle
        </Button>
      </Box>

      {/* İçerik alanı */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
        }}
      >
        <Outlet />
      </Box>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Yeni Kitap Ekle</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} mt={1}>
            <Grid>
              <TextField
                label="Kitap Adı"
                name="kitap_adi"
                value={kitap.kitap_adi}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid>
              <TextField
                label="Sayfa Sayısı"
                name="sayfa_sayisi"
                type="number"
                value={kitap.sayfa_sayisi || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid>
              <TextField
                label="Stok Adedi"
                name="stok_adedi"
                type="number"
                value={kitap.stok_adedi || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid>
              <TextField
                label="Kapak URL"
                name="kapak_url"
                value={kitap.kapak_url}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid>
              <TextField
                label="Özet"
                name="ozet"
                value={kitap.ozet || ""}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={3}
              />
            </Grid>
            <Grid>
              <TextField
                label="Kategori ID"
                name="kategori_id"
                value={kitap.kategori_id || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid>
              <TextField
                label="Yayınevi ID"
                name="yayinevi_id"
                value={kitap.yayinevi_id || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid>
              <TextField
                label="Yazar ID"
                name="yazar_id"
                value={kitap.yazar_id || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid>
              <TextField
                label="Tür ID"
                name="tur_id"
                value={kitap.tur_id || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid>
              <TextField
                label="Raf ID"
                name="raf_id"
                value={kitap.raf_id || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookManagement;
