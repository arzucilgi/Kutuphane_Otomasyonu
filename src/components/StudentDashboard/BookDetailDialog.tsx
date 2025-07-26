// components/BookDetailDialog.tsx
import React from "react";
import { Box, Dialog, IconButton, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import type { Kitap } from "../../services/bookTypeService";

const KitapDetayItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
}) => (
  <Box>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1">{value ?? "Yok"}</Typography>
  </Box>
);

interface BookDetailDialogProps {
  open: boolean;
  onClose: () => void;
  kitap: Kitap | null;
}

const BookDetailDialog: React.FC<BookDetailDialogProps> = ({
  open,
  onClose,
  kitap,
}) => {
  const navigate = useNavigate();

  if (!kitap) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        sx={{
          bgcolor: "#fafafa",
          borderRadius: 2,
          overflow: "hidden",
          maxHeight: "90vh",
        }}
      >
        {/* Kapak Görseli */}
        <Box
          sx={{
            width: { xs: "100%", md: "40%" },
            height: { xs: 300, md: "auto" },
            backgroundImage: `url(${
              kitap.kapak_url || "https://via.placeholder.com/300x400"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            flexShrink: 0,
          }}
        />

        {/* Detaylar */}
        <Box
          flex={1}
          p={3}
          sx={{
            overflowY: "auto",
            maxHeight: "90vh",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {kitap.kitap_adi}
          </Typography>

          <Box display="flex" flexDirection="column" gap={2} mt={4}>
            <KitapDetayItem label="Yazar" value={kitap.yazar?.isim} />
            <KitapDetayItem label="Yayınevi" value={kitap.yayinevi?.isim} />
            <KitapDetayItem label="Sayfa Sayısı" value={kitap.sayfa_sayisi} />
            <KitapDetayItem label="Stok" value={kitap.stok_adedi} />
            <KitapDetayItem label="Kategori" value={kitap.kategori?.ad} />
            <KitapDetayItem label="Raf Numarası" value={kitap.raf?.raf_no} />
            <KitapDetayItem
              label="Eklenme Tarihi"
              value={kitap.eklenme_tarihi?.split("T")[0]}
            />

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Özet
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {kitap.ozet ?? "Özet bulunamadı."}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() =>
                navigate("/studentDashboard/rentBook", {
                  state: { kitap },
                })
              }
            >
              Hızlı Ödünç Al
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default BookDetailDialog;
