// components/RentedBooksTable.tsx
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

  return (
    <Box sx={{ width: "100%", maxWidth: 800 }}>
      <Typography variant="h6" gutterBottom>
        Kiralanan Kitaplar
      </Typography>
      {rentedBooks.length === 0 ? (
        <Typography color="text.secondary">
          Kiralanan kitap bulunmuyor.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
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
              {rentedBooks.map((book) => {
                const isReturned = !!book.teslim_edilme_tarihi;
                const remainingDays = calculateRemainingDays(
                  book.son_teslim_tarihi
                );

                return (
                  <TableRow key={book.id}>
                    <TableCell>{book.kitap_adi}</TableCell>
                    <TableCell>{book.yazar_adi}</TableCell>
                    <TableCell>
                      {book.kiralama_tarihi
                        ? new Date(book.kiralama_tarihi).toLocaleDateString()
                        : "Bilinmiyor"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {book.teslim_edilme_tarihi
                        ? new Date(
                            book.teslim_edilme_tarihi
                          ).toLocaleDateString()
                        : "Henüz Teslim Edilmedi"}
                    </TableCell>
                    <TableCell>
                      {book.son_teslim_tarihi
                        ? new Date(book.son_teslim_tarihi).toLocaleDateString()
                        : "Belirlenmemiş"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {isReturned ? (
                        "Teslim Edildi"
                      ) : remainingDays !== null ? (
                        <span
                          style={{
                            color: remainingDays <= 3 ? "red" : "inherit",
                            fontWeight: remainingDays <= 3 ? "bold" : "normal",
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
