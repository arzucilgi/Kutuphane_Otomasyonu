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
} from "@mui/material";
import { fetchUserFavorites } from "../../services/FavoriteService";
import { supabase } from "../../lib/supabaseClient";
import type { Kitap } from "../../services/bookTypeService";

const FavoriteBooksTable: React.FC = () => {
  const [favoriteBooks, setFavoriteBooks] = useState<Kitap[]>([]);
  console.log(favoriteBooks);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

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
      console.log(favoriteIds);

      if (favoriteIds.length === 0) {
        setFavoriteBooks([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("kitaplar")
        .select("*,yazar: yazar_id (id, isim)")
        .in("id", favoriteIds);

      if (error) {
        console.error("Kitap verisi çekilemedi:", error.message);
        setFavoriteBooks([]);
      } else {
        setFavoriteBooks(data);
      }

      setLoading(false);
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
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
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Favori Kitapların
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Kapak</TableCell>
            <TableCell>Kitap Adı</TableCell>
            <TableCell>Yazar</TableCell>
            <TableCell>Sayfa Sayısı</TableCell>
            <TableCell>Stok Sayısı</TableCell>
            <TableCell>Hızlı Ödünç Al</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {favoriteBooks
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((book) => (
              <TableRow key={book.id}>
                <TableCell>
                  <img
                    src={book.kapak_url}
                    alt={book.kitap_adi}
                    style={{ width: 60, height: 90, objectFit: "cover" }}
                  />
                </TableCell>
                <TableCell>{book.kitap_adi}</TableCell>
                <TableCell>{book.yazar?.isim}</TableCell>
                <TableCell>{book.sayfa_sayisi}</TableCell>
                <TableCell>{book.stok_adedi}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[8]}
        component="div"
        count={favoriteBooks.length}
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
          //İLERİ – GERİ BUTONLARINI BÜYÜTÜR
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
