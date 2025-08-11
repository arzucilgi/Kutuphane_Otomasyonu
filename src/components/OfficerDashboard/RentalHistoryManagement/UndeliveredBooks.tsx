// UndeliveredBooks.tsx

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Divider,
  Button,
  useTheme,
  Stack,
  Alert,
  TextField,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import { supabase } from "../../../lib/supabaseClient";
import type { Kiralama } from "../../../services/StudentServices/bookTypeService";
import ConfirmDialog from "../../../components/OfficerDashboard/StudentManagement/ConfirmDialog";
import SearchIcon from "@mui/icons-material/Search";

const ITEMS_PER_PAGE = 5;

const UndeliveredBooks: React.FC = () => {
  const [rentals, setRentals] = useState<Kiralama[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const filteredRentals = rentals.filter((rental) => {
    console.log(rental);
    const query = searchQuery.toLowerCase();

    const kitapAdi = rental.kitaplar?.[0]?.kitap_adi?.toLowerCase() || "";
    const yazar = rental.kitaplar?.[0]?.yazarlar?.isim?.toLowerCase() || "";
    const adSoyad = rental.kullanicilar?.ad_soyad?.toLowerCase() || "";
    const eposta = rental.kullanicilar?.eposta?.toLowerCase() || "";

    return (
      kitapAdi.includes(query) ||
      yazar.includes(query) ||
      adSoyad.includes(query) ||
      eposta.includes(query)
    );
  });

  const paginatedRentals = filteredRentals.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredRentals.length / ITEMS_PER_PAGE);

  const fetchUndeliveredBooks = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("kiralamalar")
      .select(
        `
        id,
        kiralama_tarihi,
        teslim_edilme_tarihi,
        son_teslim_tarihi,
        kitap_id,
        aktif,
        kullanicilar (
          ad_soyad,
          eposta
        ),
        kitaplar:kitap_id (
          id,
          kitap_adi,
          stok_adedi,
          yazarlar:yazar_id (
            isim
          ),
          yayinevleri:yayinevi_id (
            isim
          )
        )
      `
      )
      .is("teslim_edilme_tarihi", null)
      .eq("aktif", true);

    if (error) {
      setError("Veriler alınırken hata oluştu.");
      setRentals([]);
    } else if (!data || data.length === 0) {
      setRentals([]);
    } else {
      const normalizedData = data.map((item: any) => ({
        ...item,
        kullanicilar: Array.isArray(item.kullanicilar)
          ? item.kullanicilar[0]
          : item.kullanicilar,
        kitaplar: item.kitaplar
          ? Array.isArray(item.kitaplar)
            ? item.kitaplar
            : [item.kitaplar]
          : [],
      }));

      setRentals(normalizedData as Kiralama[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUndeliveredBooks();
  }, []);

  const handleOpenConfirm = (id: string) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedId) return;

    setSubmittingId(selectedId);
    setConfirmOpen(false);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Giriş yapan memur bilgisi alınamadı.");
      setSubmittingId(null);
      setSelectedId(null);
      return;
    }

    const rental = rentals.find((r) => r.id === selectedId);
    if (!rental) {
      setError("Seçilen kiralama bulunamadı.");
      setSubmittingId(null);
      setSelectedId(null);
      return;
    }

    const kitapId =
      rental.kitaplar && rental.kitaplar.length > 0
        ? rental.kitaplar[0].id
        : null;

    if (!kitapId) {
      setError("Kitap bilgisi bulunamadı.");
      setSubmittingId(null);
      setSelectedId(null);
      return;
    }

    const { error: teslimError } = await supabase
      .from("kiralamalar")
      .update({
        teslim_edilme_tarihi: new Date().toISOString(),
        teslim_alan_memur_id: user.id,
      })
      .eq("id", selectedId);

    if (teslimError) {
      setError("Teslim işlemi sırasında hata oluştu.");
      setSubmittingId(null);
      return;
    }

    const { error: stokError } = await supabase.rpc("increase_stock", {
      book_id: kitapId,
    });

    if (stokError) {
      setError("Stok güncellenemedi.");
    } else {
      await fetchUndeliveredBooks();
      setError("");
    }

    setSubmittingId(null);
    setSelectedId(null);
  };

  const renderBooks = (books: any) => {
    if (!books) return null;
    const bookList = Array.isArray(books) ? books : [books];

    return bookList.map((book, index) => (
      <Box key={index} mt={1}>
        <Typography variant="body1" fontWeight="bold">
          {book.kitap_adi}
        </Typography>
        {book.yazarlar?.isim && (
          <Typography variant="body2" color="text.secondary">
            Yazar: {book.yazarlar.isim}
          </Typography>
        )}
        {book.yayinevleri?.isim && (
          <Typography variant="body2" color="text.secondary">
            Yayın Evi: {book.yayinevleri.isim}
          </Typography>
        )}
      </Box>
    ));
  };

  return (
    <Box p={4} sx={{}}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : rentals.length === 0 ? (
        <>
          <Typography
            variant="h5"
            mb={4}
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            Teslim Edilmeyen Kitaplar
          </Typography>
          <Alert severity="info">Henüz teslim edilmemiş kitap yok.</Alert>
        </>
      ) : (
        <>
          {" "}
          <Box
            display="flex"
            justifyContent="space-between"
            mb={3}
            flexDirection={isSmallScreen ? "column" : "row"}
            gap={isSmallScreen ? 2 : 0} // Mobilde araya boşluk
            alignItems={isSmallScreen ? "stretch" : "center"} // Mobilde tam genişlik, büyük ekranda ortala
          >
            <Typography
              variant="h5"
              mb={isSmallScreen ? 4 : 0}
              fontWeight="bold"
              color={theme.palette.primary.main}
            >
              Teslim Edilmeyen Kitaplar
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
                setPage(0); // Arama yapılınca ilk sayfaya dön
              }}
              sx={{ width: "100%", maxWidth: 500 }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
              alignItems: "stretch",
              maxWidth: "100%",
              margin: "auto",
            }}
          >
            {paginatedRentals.map((rental) => (
              <Card
                key={rental.id}
                sx={{
                  width: 250,
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
                      {rental.kiralama_tarihi
                        ? new Date(rental.kiralama_tarihi).toLocaleDateString()
                        : "-"}
                    </Typography>
                    <Typography variant="body2">
                      Son Teslim:{" "}
                      {rental.son_teslim_tarihi
                        ? new Date(
                            rental.son_teslim_tarihi
                          ).toLocaleDateString()
                        : "-"}
                    </Typography>

                    <Divider />

                    <Typography variant="subtitle2" fontWeight="bold">
                      Kitaplar
                    </Typography>

                    {renderBooks(rental.kitaplar)}

                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenConfirm(rental.id)}
                      disabled={submittingId === rental.id}
                      sx={{ mt: 2 }}
                    >
                      {submittingId === rental.id
                        ? "Teslim Alınıyor..."
                        : "Teslim Al"}
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
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              ◀ Geri
            </Button>
            <Typography>
              Sayfa {page + 1} / {totalPages}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page + 1 >= totalPages}
            >
              İleri ▶
            </Button>
          </Box>
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Teslim Almayı Onaylıyor Musunuz?"
        message="Bu kitabın teslim alındığını onaylamak istiyor musunuz?"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default UndeliveredBooks;
