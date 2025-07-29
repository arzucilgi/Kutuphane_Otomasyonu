import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
  Paper,
  TablePagination,
  Button,
  Rating,
  TextField,
} from "@mui/material";
import { supabase } from "../../lib/supabaseClient";
import { fetchUserFavorites } from "../../services/StudentServices/FavoriteService";
import { fetchAverageRatingByBookId } from "../../services/StudentServices/commentService";
import type { Kitap } from "../../services/StudentServices/bookTypeService";
import BookDetailDialog from "../../components/StudentDashboard/BookDetailDialog";

const FavoriteBooksTable: React.FC = () => {
  const [favoriteBooks, setFavoriteBooks] = useState<Kitap[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const rowsPerPage = 6;
  const [averageRatings, setAverageRatings] = useState<{
    [bookId: string]: number;
  }>({});
  const [selectedKitap, setSelectedKitap] = useState<Kitap | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        console.error("Oturum bilgisi alınamadı:", sessionError?.message);
        setFavoriteBooks([]);
        setLoading(false);
        return;
      }

      const userId = session.user.id;
      const favoriteIds = await fetchUserFavorites(userId);

      if (favoriteIds.length === 0) {
        setFavoriteBooks([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("kitaplar")
        .select(
          "*, yazar: yazar_id (id, isim) ,kategori:kategori_id(id,ad), raf:raf_id(id, raf_no)"
        )
        .in("id", favoriteIds);

      if (error) {
        console.error("Kitap verisi çekilemedi:", error.message);
        setFavoriteBooks([]);
      } else {
        setFavoriteBooks(data);

        const ratings = await Promise.all(
          data.map(async (book) => {
            try {
              const avg = await fetchAverageRatingByBookId(book.id);
              return { kitapId: book.id, avg };
            } catch {
              return { kitapId: book.id, avg: 0 };
            }
          })
        );

        const ratingMap: { [id: string]: number } = {};
        ratings.forEach(({ kitapId, avg }) => {
          ratingMap[kitapId] = avg;
        });

        setAverageRatings(ratingMap);
      }

      setLoading(false);
    };

    fetchFavorites();
  }, []);

  // Arama filtreleme
  const filteredBooks = favoriteBooks.filter((book) =>
    `${book.kitap_adi} ${book.yazar?.isim || ""}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Arama yapılınca sayfa sıfırlansın
  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (favoriteBooks.length === 0) {
    return (
      <Typography mt={5} textAlign="center" color="text.secondary">
        Henüz favorilenmiş kitap yok.
      </Typography>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        m: 4,
        borderRadius: "16px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "row",
          },
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" color="primary.main" fontWeight={600}>
          Favori Kitaplarım
        </Typography>

        <TextField
          label="Kitap veya Yazar Ara"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: {
              xs: "100%",
              sm: "100%",
              md: "30%",
            },
          }}
        />
      </Box>
      <Box sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#bbdefb",
                "& th": {
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  color: "#777575ff",
                },
              }}
            >
              <TableCell>Kapak</TableCell>
              <TableCell>Kitap Adı</TableCell>
              <TableCell>Yazar</TableCell>
              <TableCell>Sayfa Sayısı</TableCell>
              <TableCell>Stok Sayısı</TableCell>
              <TableCell>Ortalama Puan</TableCell>
              <TableCell>Detay</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((book) => (
                <TableRow
                  key={book.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                    },
                  }}
                >
                  <TableCell>
                    <img
                      src={book.kapak_url ?? "/placeholder.png"}
                      alt={book.kitap_adi}
                      style={{
                        width: 60,
                        height: 90,
                        objectFit: "cover",
                        borderRadius: 4,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    />
                  </TableCell>
                  <TableCell>{book.kitap_adi}</TableCell>
                  <TableCell>{book.yazar?.isim}</TableCell>
                  <TableCell>{book.sayfa_sayisi ?? "-"}</TableCell>
                  <TableCell>{book.stok_adedi ?? "-"}</TableCell>
                  <TableCell>
                    <Rating
                      value={averageRatings[book.id] || 0}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#0d47a1",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#1565c0",
                        },
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        textTransform: "none",
                      }}
                      onClick={() => setSelectedKitap(book)}
                    >
                      Kitap Detayı
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>

      <BookDetailDialog
        open={!!selectedKitap}
        onClose={() => setSelectedKitap(null)}
        kitap={selectedKitap}
      />

      <TablePagination
        rowsPerPageOptions={[rowsPerPage]}
        component="div"
        count={filteredBooks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "& .MuiTablePagination-toolbar": {
            fontSize: "1.2rem",
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "#0d47a1",
            },
          "& .MuiTablePagination-select": {
            fontSize: "1.1rem",
          },
          "& .MuiIconButton-root": {
            padding: "8px",
            color: "#0d47a1",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "2rem",
          },
        }}
      />
    </Paper>
  );
};

export default FavoriteBooksTable;
