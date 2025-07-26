import React, { useEffect, useState } from "react";
import {
  fetchLoggedInUserProfile,
  fetchBooksRentedByUser,
} from "../../services/userService";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Rating,
  TablePagination,
} from "@mui/material";
import type { Comment } from "../../services/bookTypeService";
import {
  addReview,
  updateReview,
  fetchReviewsByBookId,
  fetchAverageRatingByBookId,
} from "../../services/commentService";
import { toast } from "react-toastify";

interface AggregatedRental {
  kitap_id: string;
  kitap_adi: string;
  yazar_adi: string;
  ilk_kiralama_tarihi: string;
  son_teslim_tarihi: string;
  okunma_sayisi: number;
}

interface ExistingReview extends Comment {
  id: string;
}

const UserRentHistoryTable: React.FC = () => {
  const [rentedBooks, setRentedBooks] = useState<AggregatedRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [existingReview, setExistingReview] = useState<ExistingReview | null>(
    null
  );
  const [averageRatings, setAverageRatings] = useState<{
    [kitap_id: string]: number;
  }>({});

  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<AggregatedRental | null>(
    null
  );
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 8;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleOpen = async (book: AggregatedRental) => {
    setSelectedBook(book);
    setOpen(true);
    try {
      const reviews = await fetchReviewsByBookId(book.kitap_id);
      const userReview = reviews.find((rev) => rev.kullanici_id === userId);
      if (userReview) {
        setExistingReview(userReview);
        setRating(userReview.puan);
        setComment(userReview.yorum);
      } else {
        setExistingReview(null);
        setRating(0);
        setComment("");
      }
    } catch (error) {
      console.error("Review fetch error:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setRating(0);
    setComment("");
    setSelectedBook(null);
  };

  const handleSubmit = async () => {
    if (!rating || !selectedBook || !userId) return;

    const payload = {
      kitap_id: selectedBook.kitap_id,
      kullanici_id: userId,
      yorum: comment,
      puan: rating,
      tarih: new Date().toISOString(),
    };

    try {
      if (existingReview) {
        await updateReview(existingReview.id, {
          yorum: comment,
          puan: rating,
          tarih: new Date().toISOString(),
        });
        toast.success("Yorum güncellendi.");
      } else {
        await addReview(payload);
        toast.success("Yorum eklendi.");
      }
      const newAvg = await fetchAverageRatingByBookId(selectedBook.kitap_id);
      setAverageRatings((prev) => ({
        ...prev,
        [selectedBook.kitap_id]: newAvg,
      }));
      handleClose();
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("Yorum yapılırken bir hata oluştu!");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const user = await fetchLoggedInUserProfile();
      if (user) {
        setUserId(user.id);
        const allRentals = await fetchBooksRentedByUser(user.id);
        const returnedBooks = allRentals.filter(
          (rental: any) => rental.teslim_edilme_tarihi !== null
        );

        const grouped: { [kitap_adi: string]: AggregatedRental } = {};
        for (const rental of returnedBooks) {
          const key = rental.kitap_adi;
          if (!grouped[key]) {
            grouped[key] = {
              kitap_id: rental?.kitap_id ?? key,
              kitap_adi: rental.kitap_adi,
              yazar_adi: rental.yazar_adi,
              ilk_kiralama_tarihi: rental.kiralama_tarihi,
              son_teslim_tarihi: rental.teslim_edilme_tarihi,
              okunma_sayisi: 1,
            };
          } else {
            grouped[key].okunma_sayisi += 1;
            const first = new Date(grouped[key].ilk_kiralama_tarihi);
            const current = new Date(rental.kiralama_tarihi);
            if (current < first)
              grouped[key].ilk_kiralama_tarihi = rental.kiralama_tarihi;

            const latest = new Date(grouped[key].son_teslim_tarihi);
            const currentDelivered = new Date(rental.teslim_edilme_tarihi);
            if (currentDelivered > latest)
              grouped[key].son_teslim_tarihi = rental.teslim_edilme_tarihi;
          }
        }

        const rentalsArray = Object.values(grouped);
        setRentedBooks(rentalsArray);

        const ratingFetches = rentalsArray.map(async (book) => {
          try {
            const avg = await fetchAverageRatingByBookId(book.kitap_id);
            return { kitap_id: book.kitap_id, avg };
          } catch (error) {
            return { kitap_id: book.kitap_id, avg: 0 };
          }
        });

        const results = await Promise.all(ratingFetches);
        const avgMap: { [kitap_id: string]: number } = {};
        results.forEach(({ kitap_id, avg }) => (avgMap[kitap_id] = avg));
        setAverageRatings(avgMap);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (rentedBooks.length === 0)
    return (
      <Box textAlign="center" mt={4}>
        <Typography>No returned books found for the user.</Typography>
      </Box>
    );

  return (
    <Box
      m={4}
      p={4}
      sx={{
        // backgroundColor: "#e3f2fd",
        borderRadius: 3,
        boxShadow: "0 6px 24px rgba(33, 150, 243, 0.2)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        color="primary.main"
        fontWeight={600}
      >
        Okuduğum Kitaplar
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#bbdefb" }}>
              {[
                "Kitap Adı",
                "Yazarı",
                "İlk Kiralama",
                "Son Teslim",
                "Okuma Sayısı",
                "Yorum",
                "Ortalama Puan",
              ].map((header, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    color: "#777575ff",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rentedBooks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((book) => (
                <TableRow
                  key={book.kitap_id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                    },
                  }}
                >
                  <TableCell>{book.kitap_adi}</TableCell>
                  <TableCell>{book.yazar_adi}</TableCell>
                  <TableCell>
                    {new Date(book.ilk_kiralama_tarihi).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(book.son_teslim_tarihi).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{book.okunma_sayisi}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleOpen(book)}
                      color="primary"
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 6px rgba(33, 150, 243, 0.3)",
                        transition: "0.3s",
                        "&:hover": {
                          backgroundColor: "#1976d2",
                        },
                      }}
                    >
                      Yorum Yap
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Rating
                      value={averageRatings[book.kitap_id] || 0}
                      precision={0.5}
                      readOnly
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[8]}
          component="div"
          count={rentedBooks.length}
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
      </TableContainer>

      {/* Review Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: "#e3f2fd", fontWeight: 600 }}>
          Kitap Yorumla
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Rating
            name="book-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Yorumunuz"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="text">
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!rating}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "0 2px 6px rgba(33, 150, 243, 0.4)",
            }}
          >
            Gönder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserRentHistoryTable;
