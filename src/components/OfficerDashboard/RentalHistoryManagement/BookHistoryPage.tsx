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
  Fade,
  Stack,
  Alert,
} from "@mui/material";
import { supabase } from "../../../lib/supabaseClient";
import type { Kiralama } from "../../../services/StudentServices/bookTypeService";
import ConfirmDialog from "../../../components/OfficerDashboard/StudentManagement/ConfirmDialog";

const ITEMS_PER_PAGE = 6;

const BookHistoryPage: React.FC = () => {
  const [rentals, setRentals] = useState<Kiralama[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [page, setPage] = useState(0);
  const theme = useTheme();

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

    console.log("fetch error:", error);
    console.log("fetch data:", data);

    if (error) {
      setError("Veriler alınırken hata oluştu.");
      setRentals([]);
    } else if (!data || data.length === 0) {
      setRentals([]);
    } else {
      // normalize data: kitaplar bazen tek nesne olabilir, bazen array, ona göre düzeltelim
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

  const paginatedRentals = rentals.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(rentals.length / ITEMS_PER_PAGE);

  const handleOpenConfirm = (id: string) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedId) return;

    setSubmittingId(selectedId);
    setConfirmOpen(false);

    // Kiralamayı bul
    const rental = rentals.find((r) => r.id === selectedId);
    if (!rental) {
      setError("Seçilen kiralama bulunamadı.");
      setSubmittingId(null);
      setSelectedId(null);
      return;
    }

    // Kitap ID'sini al
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

    // Teslim tarihini güncelle
    const { error: teslimError } = await supabase
      .from("kiralamalar")
      .update({ teslim_edilme_tarihi: new Date().toISOString() })
      .eq("id", selectedId);

    if (teslimError) {
      console.error("Teslim güncelleme hatası:", teslimError);
      setError("Teslim işlemi sırasında hata oluştu.");
      setSubmittingId(null);
      return;
    }

    // Stok artırma prosedürünü çağır
    const { error: stokError } = await supabase.rpc("increase_stock", {
      book_id: kitapId,
    });

    if (stokError) {
      console.error("Stok artırma hatası:", stokError);
      setError("Stok güncellenemedi.");
    } else {
      await fetchUndeliveredBooks();
      setError(""); // önceki hatayı temizle
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
    <Box p={4}>
      <Typography
        variant="h4"
        mb={4}
        fontWeight="bold"
        color={theme.palette.primary.main}
      >
        Teslim Edilmeyen Kitaplar
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : rentals.length === 0 ? (
        <Alert severity="info">Henüz teslim edilmemiş kitap yok.</Alert>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
              maxWidth: "100%",
              margin: "auto",
            }}
          >
            {paginatedRentals.map((rental) => (
              <Fade in timeout={500} key={rental.id}>
                <Card
                  sx={{
                    width: 250,
                    borderRadius: 4,
                    boxShadow: 6,
                    transition: "0.3s",
                    "&:hover": { boxShadow: 10 },
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

                      <Typography variant="body2" color="textSecondary">
                        Kiralama Tarihi:{" "}
                        {rental.kiralama_tarihi
                          ? new Date(
                              rental.kiralama_tarihi
                            ).toLocaleDateString()
                          : "-"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Son Teslim:{" "}
                        {rental.son_teslim_tarihi
                          ? new Date(
                              rental.son_teslim_tarihi
                            ).toLocaleDateString()
                          : "-"}
                      </Typography>

                      <Divider />

                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        mt={1}
                        gutterBottom
                      >
                        Kitaplar
                      </Typography>

                      {renderBooks(rental.kitaplar)}

                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenConfirm(rental.id)}
                        disabled={submittingId === rental.id}
                        sx={{
                          mt: 2,
                          textTransform: "none",
                          fontWeight: "bold",
                          py: 1,
                        }}
                      >
                        {submittingId === rental.id
                          ? "Teslim Alınıyor..."
                          : "Teslim Al"}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Box>

          {/* Sayfa Kontrolleri */}
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
              ⬅️ Geri
            </Button>
            <Typography>
              Sayfa {page + 1} / {totalPages}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page + 1 >= totalPages}
            >
              İleri ➡️
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

export default BookHistoryPage;
