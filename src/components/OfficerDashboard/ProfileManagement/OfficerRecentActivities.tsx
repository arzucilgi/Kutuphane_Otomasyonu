import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
} from "@mui/material";

interface ActivityProps {
  recentBooks: {
    id: string;
    kitap_adi: string;
    eklenme_tarihi?: string;
    yazarlar?: { isim: string };
    yayinevleri?: { isim: string };
    raflar?: { raf_no: string };
  }[];
  recentRentals: {
    id: string;
    kiralama_tarihi: string;
    kitaplar?: { kitap_adi: string; yazarlar?: { isim: string } };
    kullanicilar?: { ad_soyad: string };
  }[];
  recentStudents: {
    id: string;
    ad_soyad: string;
    eposta: string;
    olusturulma_tarihi?: string;
  }[];
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const OfficerRecentActivities: React.FC<ActivityProps> = ({
  recentBooks,
  recentRentals,
  recentStudents,
}) => {
  console.log("Son Kiralamalar:", recentRentals);
  return (
    <Stack spacing={4} sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      {/* Son Eklenen Kitaplar */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Son Eklenen Kitaplar
        </Typography>
        {recentBooks.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Henüz kitap eklenmemiş.
          </Typography>
        ) : (
          <List dense>
            {recentBooks.map((book) => (
              <ListItem key={book.id} divider>
                <ListItemText
                  primary={`${book.kitap_adi} `}
                  secondary={
                    <>
                      <div>
                        Eklenme Tarihi: {formatDate(book.eklenme_tarihi)}
                      </div>
                      <div>Yazar: {book.yazarlar?.isim || "-"}</div>
                      <div>Yayınevi: {book.yayinevleri?.isim || "-"}</div>
                      <div>Raf: {book.raflar?.raf_no || "-"}</div>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Son Onaylanan Kiralamalar */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Son Onaylanan Kiralamalar
        </Typography>
        {recentRentals.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Henüz kiralama onayı yapılmamış.
          </Typography>
        ) : (
          <List dense>
            {recentRentals.map((rental) => (
              <ListItem key={rental.id} divider>
                <ListItemText
                  primary={`Kiralayan: ${
                    rental.kullanicilar?.ad_soyad || "Bilinmiyor"
                  }`}
                  secondary={
                    <>
                      <div>
                        Kitap: {rental.kitaplar?.kitap_adi || "Bilinmiyor"}
                      </div>
                      <div>
                        Yazar: {rental.kitaplar?.yazarlar?.isim || "Bilinmiyor"}
                      </div>
                      <div>
                        Kiralama Tarihi: {formatDate(rental.kiralama_tarihi)}
                      </div>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Son Yapılan Öğrenci Kayıtları */}
      {/* Son Yapılan Öğrenci Kayıtları */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Son Yapılan Öğrenci Kayıtları
        </Typography>
        {recentStudents.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Henüz öğrenci kaydı yapılmamış.
          </Typography>
        ) : (
          <List dense>
            {recentStudents.map((student) => (
              <ListItem key={student.id} divider>
                <ListItemText
                  primary={student.ad_soyad}
                  secondary={
                    <>
                      <div>E-Posta: {student.eposta}</div>
                      <div>
                        Kayıt Tarihi: {formatDate(student.olusturulma_tarihi)}
                      </div>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Stack>
  );
};

export default OfficerRecentActivities;
