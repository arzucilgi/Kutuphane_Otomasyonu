import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Grid,
  Divider,
  Avatar,
  Button,
  Stack,
  CardMedia,
  Paper,
} from "@mui/material";
import { fetchBooksRentedByUser } from "../../../services/StudentServices/userService";
import { supabase } from "../../../lib/supabaseClient";

interface Student {
  id: string;
  ad_soyad: string;
  eposta: string;
  rol: string;
  olusturulma_tarihi: string;
  kapak_url: string;
}

const ITEMS_PER_PAGE = 5;

const StudentRentalHistoryPage = () => {
  const { studentId } = useParams();
  const [rentals, setRentals] = useState<any[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const [topAuthor, setTopAuthor] = useState<string | null>(null);
  const [delayCount, setDelayCount] = useState<number>(0);
  const [topGenre, setTopGenre] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (!studentId) {
        setError("Geçersiz öğrenci ID");
        setLoading(false);
        return;
      }

      try {
        const allRentals = await fetchBooksRentedByUser(studentId);
        const returnedBooks = allRentals.filter(
          (rental: any) => rental.teslim_edilme_tarihi !== null
        );
        setRentals(returnedBooks);

        if (returnedBooks.length > 0) {
          // En çok okunan yazar
          const authorMap: Record<string, number> = {};
          returnedBooks.forEach((r: any) => {
            const author = r.yazar_adi;
            if (author) authorMap[author] = (authorMap[author] || 0) + 1;
          });
          const sortedAuthors = Object.entries(authorMap).sort(
            (a, b) => b[1] - a[1]
          );
          if (sortedAuthors.length > 0) setTopAuthor(sortedAuthors[0][0]);

          // Teslim gecikmeleri
          const delays = returnedBooks.filter((r) => {
            if (!r.son_teslim_tarihi || !r.teslim_edilme_tarihi) return false;
            const planned = new Date(r.son_teslim_tarihi);
            const actual = new Date(r.teslim_edilme_tarihi);
            return actual > planned;
          });
          setDelayCount(delays.length);

          // En çok okunan kitap türü
          const genreMap: Record<string, number> = {};
          returnedBooks.forEach((r: any) => {
            const genre = r.kategori_adi || "Bilinmeyen";
            genreMap[genre] = (genreMap[genre] || 0) + 1;
          });
          const sortedGenres = Object.entries(genreMap).sort(
            (a, b) => b[1] - a[1]
          );
          console.log("En çok okunan kitap türleri:", sortedGenres); // debug için
          if (sortedGenres.length > 0) {
            setTopGenre(sortedGenres[0][0]);
            console.log("Top Genre:", sortedGenres[0][0]); // debug için
          }
        }

        const { data, error: userError } = await supabase
          .from("kullanicilar")
          .select("*")
          .eq("id", studentId)
          .single();

        if (userError) {
          console.error("Öğrenci bilgisi alınırken hata:", userError.message);
        } else {
          setStudent(data);
        }
      } catch (err) {
        console.error(err);
        setError("Veriler alınırken bir hata oluştu.");
      }

      setLoading(false);
    };

    fetchData();
  }, [studentId]);

  const totalPages = Math.ceil(rentals.length / ITEMS_PER_PAGE);
  const paginatedRentals = rentals.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box p={3} width={"90%"} mx="auto">
      {student && (
        <Paper elevation={4} sx={{ mb: 5, p: 3, borderRadius: 3 }}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            gap={2}
            flexWrap="wrap"
          >
            <Box display="flex" alignItems="center" gap={3}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>
                {student.ad_soyad.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  {student.ad_soyad}
                </Typography>
                <Typography color="text.secondary">{student.eposta}</Typography>
                <Typography color="text.secondary">
                  Kayıt Tarihi:{" "}
                  {new Date(student.olusturulma_tarihi).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            {/* İstatistikler */}
            <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
              <StatCard label="Teslim Edilen Kitap" value={rentals.length} />
              <StatCard
                label="Toplam Okunan Kitap Sayısı"
                value={rentals.length}
              />
              <StatCard label="Teslim Gecikmesi" value={delayCount} />
              <StatCard label="En Çok Okunan Yazar" value={topAuthor || "-"} />
              <StatCard
                label="En Çok Okunan Kitap Türü"
                value={topGenre || "-"}
              />
            </Stack>
          </Box>
        </Paper>
      )}

      {/* Kitaplar */}
      <Typography variant="h5" gutterBottom fontWeight={600} mt={6}>
        Okuduğu Kitaplar
      </Typography>
      <Divider sx={{ mb: 4 }} />
      {rentals.length === 0 ? (
        <Alert severity="info">Henüz teslim edilmiş kitap bulunamadı.</Alert>
      ) : (
        <>
          <Grid container spacing={4}>
            {paginatedRentals.map((rental) => (
              <Grid key={rental.id}>
                <Card
                  sx={{
                    height: "100%",
                    width: "250px",
                    borderRadius: 3,
                    boxShadow: 4,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  {rental.kapak_url && (
                    <CardMedia
                      component="img"
                      image={rental.kapak_url}
                      alt={rental.kitap_adi}
                      height="200"
                      sx={{
                        objectFit: "contain",
                        borderRadius: "12px 12px 0 0",
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {rental.kitap_adi}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {rental.yazar_adi}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      Kiralama:{" "}
                      {new Date(rental.kiralama_tarihi).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      Teslim:{" "}
                      {new Date(
                        rental.teslim_edilme_tarihi
                      ).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Sayfalama */}
          <Stack direction="row" justifyContent="center" spacing={2} mt={5}>
            <Button
              variant="contained"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              ◀ Geri
            </Button>
            <Typography
              variant="body2"
              sx={{
                px: 2,
                py: 1,
                border: "1px solid",
                borderRadius: 2,
                borderColor: "grey.300",
              }}
            >
              Sayfa {page} / {totalPages}
            </Typography>
            <Button
              variant="contained"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              İleri ▶
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <Paper
    elevation={2}
    sx={{
      px: 2,
      py: 1,
      borderRadius: 2,
      minWidth: 120,
      textAlign: "center",
      backgroundColor: "#f9fafb",
    }}
  >
    <Typography variant="h6" color="primary">
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Paper>
);

export default StudentRentalHistoryPage;
