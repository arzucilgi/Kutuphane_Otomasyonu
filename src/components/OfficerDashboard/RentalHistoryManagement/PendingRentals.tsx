// PendingRentals.tsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Divider,
  Button,
  Stack,
  Alert,
  useTheme,
  TextField,
  InputAdornment,
} from "@mui/material";
import { supabase } from "../../../lib/supabaseClient";
import SearchIcon from "@mui/icons-material/Search";

import ConfirmDialog from "../StudentManagement/ConfirmDialog"; // ConfirmDialog'un yolu sana bağlı

interface PendingRental {
  id: string;
  kiralama_tarihi: string;
  son_teslim_tarihi: string;
  kullanicilar: {
    ad_soyad: string;
    eposta: string;
  };
  kitaplar: {
    kitap_adi: string;
    yazarlar?: { isim: string };
    yayinevleri?: { isim: string };
  }[];
}

const ITEMS_PER_PAGE = 5;

const PendingRentals: React.FC = () => {
  const [pendingRentals, setPendingRentals] = useState<PendingRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog ile ilgili state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedRentalId, setSelectedRentalId] = useState<string | null>(null);

  const theme = useTheme();

  const fetchPendingRentals = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("kiralamalar")
      .select(
        `
        id,
        kiralama_tarihi,
        son_teslim_tarihi,
        aktif,
        kullanicilar (
          ad_soyad,
          eposta
        ),
        kitaplar:kitap_id (
          kitap_adi,
          yazarlar:yazar_id (isim),
          yayinevleri:yayinevi_id (isim)
        )
      `
      )
      .eq("aktif", false);

    if (error) {
      setError("Onay bekleyen kitaplar alınırken hata oluştu.");
      setPendingRentals([]);
    } else if (!data) {
      setPendingRentals([]);
    } else {
      const normalized = data.map((item: any) => ({
        ...item,
        kullanicilar: Array.isArray(item.kullanicilar)
          ? item.kullanicilar[0]
          : item.kullanicilar,
        kitaplar: Array.isArray(item.kitaplar)
          ? item.kitaplar
          : item.kitaplar
          ? [item.kitaplar]
          : [],
      }));

      setPendingRentals(normalized);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPendingRentals();
  }, []);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    setConfirmDialogOpen(false); // Dialogu kapat

    const { error } = await supabase
      .from("kiralamalar")
      .update({ aktif: true })
      .eq("id", id);

    if (error) {
      setError("Onaylama işlemi başarısız.");
    } else {
      await fetchPendingRentals();
    }

    setApprovingId(null);
    setSelectedRentalId(null);
  };

  // Onayla butonuna basınca dialog aç
  const handleOpenConfirmDialog = (id: string) => {
    setSelectedRentalId(id);
    setConfirmDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    setConfirmDialogOpen(false);
    setSelectedRentalId(null);
  };

  // Filtreleme
  const filteredRentals = pendingRentals.filter((rental) => {
    const query = searchQuery.toLowerCase();

    const kitapAdiMetni = rental.kitaplar
      ? rental.kitaplar.map((kitap) => kitap.kitap_adi.toLowerCase()).join(" ")
      : "";

    const yazarMetni = rental.kitaplar
      ? rental.kitaplar
          .map((kitap) => kitap.yazarlar?.isim?.toLowerCase() || "")
          .join(" ")
      : "";

    const adSoyad = rental.kullanicilar?.ad_soyad?.toLowerCase() || "";
    const eposta = rental.kullanicilar?.eposta?.toLowerCase() || "";

    return (
      kitapAdiMetni.includes(query) ||
      yazarMetni.includes(query) ||
      adSoyad.includes(query) ||
      eposta.includes(query)
    );
  });

  // Sayfalama
  const paginatedRentals = filteredRentals.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredRentals.length / ITEMS_PER_PAGE);

  return (
    <Box p={4}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : pendingRentals.length === 0 ? (
        <>
          <Typography
            variant="h5"
            mb={2}
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            Onay Bekleyen Kiralama Talepleri
          </Typography>
          <Alert severity="info">
            Onay bekleyen kiralama talebi bulunmamaktadır.
          </Alert>
        </>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography
              variant="h5"
              mb={2}
              fontWeight="bold"
              color={theme.palette.primary.main}
            >
              Onay Bekleyen Kiralama Talepleri
            </Typography>
            <TextField
              label="Kitap, Yazar, Ad Soyad veya E-posta Ara"
              variant="outlined"
              value={searchQuery}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              sx={{ width: "100%", maxWidth: 500 }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
              alignItems: "stretch",
              maxWidth: "100%",
              margin: "auto",
              minHeight: 200,
            }}
          >
            {paginatedRentals.map((rental) => (
              <Card
                key={rental.id}
                sx={{
                  width: 300,
                  borderRadius: 4,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 8,
                    transform: "scale(1.02)",
                  },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {rental.kullanicilar?.ad_soyad}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {rental.kullanicilar?.eposta}
                    </Typography>

                    <Divider />

                    <Typography variant="body2">
                      Kiralama Tarihi:{" "}
                      {new Date(rental.kiralama_tarihi).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      Son Teslim Tarihi:{" "}
                      {new Date(rental.son_teslim_tarihi).toLocaleDateString()}
                    </Typography>

                    <Divider />

                    <Typography variant="subtitle2" fontWeight="bold">
                      Kitap Bilgisi
                    </Typography>
                    {rental.kitaplar.map((kitap, index) => (
                      <Box key={index}>
                        <Typography>{kitap.kitap_adi}</Typography>
                        {kitap.yazarlar?.isim && (
                          <Typography variant="body2" color="text.secondary">
                            Yazar: {kitap.yazarlar.isim}
                          </Typography>
                        )}
                        {kitap.yayinevleri?.isim && (
                          <Typography variant="body2" color="text.secondary">
                            Yayın Evi: {kitap.yayinevleri.isim}
                          </Typography>
                        )}
                      </Box>
                    ))}

                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      onClick={() => handleOpenConfirmDialog(rental.id)}
                      disabled={approvingId === rental.id}
                      sx={{ mt: 2 }}
                    >
                      {approvingId === rental.id ? "Onaylanıyor..." : "Onayla"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box
            mt={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <Button
              variant="outlined"
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
            >
              ◀ Geri
            </Button>
            <Typography>
              Sayfa {page + 1} / {totalPages}
            </Typography>
            <Button
              variant="outlined"
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={page + 1 >= totalPages}
            >
              İleri ▶
            </Button>
          </Box>

          <ConfirmDialog
            open={confirmDialogOpen}
            title="Onaylama İşlemi"
            message="Bu kitabı ödünç vermek istediğinize emin misiniz?"
            onConfirm={() => {
              if (selectedRentalId) {
                handleApprove(selectedRentalId);
              }
            }}
            onCancel={handleCancelConfirm}
          />
        </>
      )}
    </Box>
  );
};

export default PendingRentals;
