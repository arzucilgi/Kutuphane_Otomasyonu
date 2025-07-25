import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
} from "@mui/material";

interface Props {
  rentedBooks: any[];
}

const RentedBooksTable: React.FC<Props> = ({ rentedBooks }) => {
  const calculateRemainingDays = (dueDate: string | null) => {
    if (!dueDate) return null;
    const today = new Date();
    const returnDateObj = new Date(dueDate);
    const diffTime = returnDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Sadece teslim edilmemiş kitapları alıyoruz
  const unreturnedBooks = rentedBooks.filter(
    (book) => !book.teslim_edilme_tarihi
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 900,
        margin: "auto",
        mt: 3,
      }}
    >
      {unreturnedBooks.length === 0 ? (
        <Typography
          color="text.secondary"
          align="center"
          sx={{ mt: 4, fontStyle: "italic" }}
        >
          Kiralanan kitap bulunmuyor.
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          elevation={6}
          sx={{
            borderRadius: 3,
            overflowX: "auto",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          <Table
            sx={{
              minWidth: 900,
              "& thead th": {
                backgroundColor: "#85bbf1ff",
                color: "white",
                fontWeight: "600",
                fontSize: "1rem",
                letterSpacing: 0.5,
              },
              "& tbody tr": {
                transition: "background-color 0.3s",
                cursor: "default",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              },
              "& tbody td": {
                fontSize: "0.95rem",
                color: "#333",
              },
            }}
            aria-label="rented books table"
          >
            <TableHead sx={{ whiteSpace: "nowrap" }}>
              <TableRow>
                <TableCell>Kitap Adı</TableCell>
                <TableCell>Yazar</TableCell>
                <TableCell>Kiralama Tarihi</TableCell>
                <TableCell>İade Edilme Tarihi</TableCell>
                <TableCell>Son Teslim Tarihi</TableCell>
                <TableCell>Kalan Gün</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unreturnedBooks.map((book) => {
                const remainingDays = calculateRemainingDays(
                  book.son_teslim_tarihi
                );

                return (
                  <TableRow key={book.id} tabIndex={-1}>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {book.kitap_adi}
                    </TableCell>
                    <TableCell>{book.yazar_adi}</TableCell>
                    <TableCell>
                      {book.kiralama_tarihi
                        ? new Date(book.kiralama_tarihi).toLocaleDateString()
                        : "Bilinmiyor"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      Henüz Teslim Edilmedi
                    </TableCell>
                    <TableCell>
                      {book.son_teslim_tarihi
                        ? new Date(book.son_teslim_tarihi).toLocaleDateString()
                        : "Belirlenmemiş"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {remainingDays !== null ? (
                        <span
                          style={{
                            color: remainingDays <= 3 ? "#d32f2f" : "#388e3c",
                            fontWeight: remainingDays <= 3 ? "700" : "500",
                          }}
                        >
                          {remainingDays <= 0
                            ? "Teslim süresi doldu!"
                            : `${remainingDays} gün kaldı`}
                        </span>
                      ) : (
                        "Bilinmiyor"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RentedBooksTable;
