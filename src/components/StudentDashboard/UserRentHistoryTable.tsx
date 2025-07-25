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
} from "@mui/material";

// Tür tanımı (gerekirse daha sonra ayrı dosyadan alabilirsin)
interface AggregatedRental {
  kitap_id: string;
  kitap_adi: string;
  yazar_adi: string;
  ilk_kiralama_tarihi: string;
  son_teslim_tarihi: string;
  okunma_sayisi: number;
}

const UserRentHistoryTable: React.FC = () => {
  const [rentedBooks, setRentedBooks] = useState<AggregatedRental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const user = await fetchLoggedInUserProfile();
      if (user) {
        const allRentals = await fetchBooksRentedByUser(user.id);

        const returnedBooks = allRentals.filter(
          (rental: any) => rental.teslim_edilme_tarihi !== null
        );

        // Kitap bazlı gruplayıp ilk kiralama, son teslim ve okunma sayısını hesapla
        const grouped: { [kitap_adi: string]: AggregatedRental } = {};

        for (const rental of returnedBooks) {
          const key = rental.kitap_adi; // kitap_id varsa onunla gruplamak daha sağlam olur
          if (!grouped[key]) {
            grouped[key] = {
              kitap_id: rental.id ?? key,
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
            if (current < first) {
              grouped[key].ilk_kiralama_tarihi = rental.kiralama_tarihi;
            }

            const latest = new Date(grouped[key].son_teslim_tarihi);
            const currentDelivered = new Date(rental.teslim_edilme_tarihi);
            if (currentDelivered > latest) {
              grouped[key].son_teslim_tarihi = rental.teslim_edilme_tarihi;
            }
          }
        }

        setRentedBooks(Object.values(grouped));
      }
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (rentedBooks.length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>
          Kullanıcıya ait teslim edilmiş kitap bulunamadı.
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={4} p={2}>
      <Typography variant="h6" gutterBottom>
        Teslim Edilmiş Kitaplar (Okunma Sayısı Dahil)
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kitap Adı</TableCell>
              <TableCell>Yazar</TableCell>
              <TableCell>İlk Kiralama</TableCell>
              <TableCell>Son Teslim</TableCell>
              <TableCell>Okunma Sayısı</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rentedBooks.map((book) => (
              <TableRow key={book.kitap_id}>
                <TableCell>{book.kitap_adi}</TableCell>
                <TableCell>{book.yazar_adi}</TableCell>
                <TableCell>
                  {new Date(book.ilk_kiralama_tarihi).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(book.son_teslim_tarihi).toLocaleDateString()}
                </TableCell>
                <TableCell>{book.okunma_sayisi}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserRentHistoryTable;
