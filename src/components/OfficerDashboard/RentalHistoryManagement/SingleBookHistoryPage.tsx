import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Button,
} from "@mui/material";
import type {
  Kitap,
  Kiralama,
} from "../../../services/StudentServices/bookTypeService";
import {
  fetchKitaplar,
  fetchYayinevleri,
  fetchYazarlar,
} from "../../../services/StudentServices/bookService";
import { fetchBookHistory } from "../../../services/StudentServices/RentCheckService";

const ITEMS_PER_PAGE = 6;

const SingleBookHistoryPage = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [rentals, setRentals] = useState<Kiralama[]>([]);
  const [book, setBook] = useState<Kitap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [yayineviAdi, setYayineviAdi] = useState<string | null>(null);
  const [yazarAdi, setYazarAdi] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!bookId) {
        setError("Kitap ID bulunamadı.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const rentalData = await fetchBookHistory(bookId);
        setRentals(rentalData);

        const kitaplar = await fetchKitaplar();
        const selectedBook = kitaplar.find((kitap) => kitap.id === bookId);
        if (!selectedBook) throw new Error("Kitap bulunamadı.");
        setBook(selectedBook);

        const allYayinevleri = await fetchYayinevleri();
        const matchedYayinevi = allYayinevleri.find(
          (y) => y.id === selectedBook.yayinevi_id
        );
        setYayineviAdi(matchedYayinevi?.isim ?? "Bilinmiyor");

        const allYazarlar = await fetchYazarlar();
        const matchedYazar = allYazarlar.find(
          (y) => y.id === selectedBook.yazar_id
        );
        setYazarAdi(matchedYazar?.isim ?? "Bilinmiyor");
      } catch (err) {
        console.error(err);
        setError("Veriler alınırken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId]);

  const paginatedRentals = rentals.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(rentals.length / ITEMS_PER_PAGE);

  return (
    <Card sx={{ mt: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          📖 Kitap Detayları
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            {book && (
              <Card
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  mb: 4,
                  p: 2,
                  boxShadow: 3,
                  borderRadius: 4,
                  backgroundColor: "#f9f9f9",
                }}
              >
                {book.kapak_url && (
                  <Box
                    sx={{
                      flexShrink: 0,
                      mr: { sm: 3 },
                      mb: { xs: 2, sm: 0 },
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={book.kapak_url}
                      alt="Kitap Kapak Görseli"
                      style={{
                        width: "160px",
                        height: "240px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                      }}
                    />
                  </Box>
                )}

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: "#333" }}>
                    📘 {book.kitap_adi}
                  </Typography>

                  <Typography variant="body1" gutterBottom>
                    <strong> Yazar:</strong> {yazarAdi ?? "Bilinmiyor"}
                  </Typography>

                  <Typography variant="body1" gutterBottom>
                    <strong> Yayın Evi:</strong> {yayineviAdi ?? "Bilinmiyor"}
                  </Typography>

                  <Typography variant="body1" gutterBottom>
                    <strong>Sayfa Sayısı:</strong> {book.sayfa_sayisi}
                  </Typography>

                  <Typography variant="body1" gutterBottom>
                    <strong>Kiralama Sayısı:</strong> Toplam {rentals.length}{" "}
                    kez kiralanmış
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 2, color: "#555" }}>
                    <strong>Özet:</strong> {book.ozet}
                  </Typography>
                </Box>
              </Card>
            )}

            <Typography variant="h6" gutterBottom>
              🔁 Kiralama Geçmişi
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {rentals.length === 0 ? (
              <Alert severity="info">
                Bu kitabı daha önce kimse kiralamamış.
              </Alert>
            ) : (
              <>
                <Grid container spacing={3}>
                  {paginatedRentals.map((rental) => {
                    const teslimEdildi = Boolean(rental.teslim_edilme_tarihi);
                    return (
                      <Grid key={rental.id}>
                        <Card
                          variant="outlined"
                          sx={{
                            height: "100%",
                            boxShadow: teslimEdildi
                              ? "0 4px 10px rgba(76, 175, 80, 0.3)"
                              : "0 4px 10px rgba(244, 67, 54, 0.3)",
                            borderRadius: 3,
                            transition: "transform 0.2s ease",
                            "&:hover": { transform: "scale(1.03)" },
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              👤 {rental.kullanicilar?.ad_soyad}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              {rental.kullanicilar?.eposta}
                            </Typography>

                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              Kiralama:{" "}
                              {new Date(
                                rental.kiralama_tarihi
                              ).toLocaleDateString("tr-TR", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </Typography>

                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              Son Teslim:{" "}
                              {rental.son_teslim_tarihi
                                ? new Date(
                                    rental.son_teslim_tarihi
                                  ).toLocaleDateString("tr-TR", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Belirtilmemiş"}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "bold",
                                color: teslimEdildi
                                  ? "success.main"
                                  : "error.main",
                              }}
                            >
                              {teslimEdildi
                                ? `✅ Teslim Edildi: ${new Date(
                                    rental.teslim_edilme_tarihi
                                  ).toLocaleDateString("tr-TR", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}`
                                : "⏳ Henüz teslim edilmedi"}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>

                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mt={3}
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
                    onClick={() =>
                      setPage((p) => Math.min(p + 1, totalPages - 1))
                    }
                    disabled={page + 1 >= totalPages}
                  >
                    İleri ▶
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SingleBookHistoryPage;
