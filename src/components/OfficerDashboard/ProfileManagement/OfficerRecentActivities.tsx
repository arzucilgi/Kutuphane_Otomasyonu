import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  useTheme,
  Box,
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
  recentReturnedBooks?: {
    id: string;
    teslim_edilme_tarihi?: string;
    kitaplar?: { kitap_adi: string; yazarlar?: { isim: string } };
    kullanicilar?: { ad_soyad: string };
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
  recentReturnedBooks = [],
}) => {
  const theme = useTheme();

  return (
    <Stack
      direction={{ xs: "column", md: "column", lg: "row" }}
      spacing={4}
      sx={{
        maxWidth: "90%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: { xs: "10px", md: "auto" },
        px: { xs: 0, md: 1 },
        flexWrap: { xs: "wrap", md: "noWrap" }, // küçük ekranlarda sarması için
      }}
    >
      {[
        {
          title: "Son Eklenen Kitaplar",
          items: recentBooks,
          renderItem: (book: any) => (
            <ListItem
              key={book.id}
              divider
              sx={{
                px: 1,
                py: 1.5,
                borderRadius: 2,
                transition: "background-color 0.3s",
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color={theme.palette.text.primary}
                  >
                    {book.kitap_adi}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 0.3, color: theme.palette.text.secondary }}>
                    <div>Eklenme Tarihi: {formatDate(book.eklenme_tarihi)}</div>
                    <div>Yazar: {book.yazarlar?.isim || "-"}</div>
                    <div>Yayınevi: {book.yayinevleri?.isim || "-"}</div>
                    <div>Raf: {book.raflar?.raf_no || "-"}</div>
                  </Box>
                }
              />
            </ListItem>
          ),
        },
        {
          title: "Son Onaylanan Kiralamalar",
          items: recentRentals,
          renderItem: (rental: any) => (
            <ListItem
              key={rental.id}
              divider
              sx={{
                px: 1,
                py: 1.2,
                borderRadius: 2,
                transition: "background-color 0.3s",
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={600}>
                    Kiralayan: {rental.kullanicilar?.ad_soyad || "Bilinmiyor"}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 0.3, color: theme.palette.text.secondary }}>
                    <div>
                      Kitap: {rental.kitaplar?.kitap_adi || "Bilinmiyor"}
                    </div>
                    <div>
                      Yazar: {rental.kitaplar?.yazarlar?.isim || "Bilinmiyor"}
                    </div>
                    <div>
                      Kiralama Tarihi: {formatDate(rental.kiralama_tarihi)}
                    </div>
                  </Box>
                }
              />
            </ListItem>
          ),
        },
        {
          title: "Son Teslim Alınan Kitaplar",
          items: recentReturnedBooks,
          renderItem: (returned: any) => (
            <ListItem
              key={returned.id}
              divider
              sx={{
                px: 1,
                py: 1.2,
                borderRadius: 2,
                transition: "background-color 0.3s",
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={600}>
                    Kiralayan: {returned.kullanicilar?.ad_soyad || "Bilinmiyor"}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 0.3, color: theme.palette.text.secondary }}>
                    <div>
                      Kitap: {returned.kitaplar?.kitap_adi || "Bilinmiyor"}
                    </div>
                    <div>
                      Yazar: {returned.kitaplar?.yazarlar?.isim || "Bilinmiyor"}
                    </div>
                    <div>
                      Kiralama Tarihi: {formatDate(returned.kiralama_tarihi)}
                    </div>
                    <div>
                      Teslim Tarihi: {formatDate(returned.teslim_edilme_tarihi)}
                    </div>
                  </Box>
                }
              />
            </ListItem>
          ),
        },
        {
          title: "Son Yapılan Öğrenci Kayıtları",
          items: recentStudents,
          renderItem: (student: any) => (
            <ListItem
              key={student.id}
              divider
              sx={{
                px: 1,
                py: 1.2,
                borderRadius: 2,
                transition: "background-color 0.3s",
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={600}>
                    {student.ad_soyad}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 0.3, color: theme.palette.text.secondary }}>
                    <div>E-Posta: {student.eposta}</div>
                    <div>
                      Kayıt Tarihi: {formatDate(student.olusturulma_tarihi)}
                    </div>
                  </Box>
                }
              />
            </ListItem>
          ),
        },
      ].map(({ title, items, renderItem }) => (
        <Paper
          key={title}
          elevation={6}
          sx={{
            px: 2,
            py: 3,
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[8],
            width: { xs: "90%", md: "70%" },
            height: 400,
            maxHeight: 400,
            // overflowY kaldırıldı burada
            display: "flex",
            flexDirection: "column",
            scrollbarGutter: "stable",

            // "&::-webkit-scrollbar": {
            //   width: "4px",
            // },
            // "&::-webkit-scrollbar-track": {
            //   backgroundColor: "transparent",
            // },
            // "&::-webkit-scrollbar-thumb": {
            //   backgroundColor: "#c0c0c0",
            //   borderRadius: "3px",
            // },

            // scrollbarWidth: "thin",
            // scrollbarColor: "#c0c0c0 transparent",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              flexShrink: 0,
              fontWeight: 700,
              color: theme.palette.grey[600],
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              px: 0,
              flexGrow: 1,
              width: "100%",
              overflowY: "auto", // Scroll sadece burada
              // minHeight: 0,
              display: "flex",
              flexDirection: "column",
              scrollbarGutter: "stable",

              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#c0c0c0",
                borderRadius: "3px",
              },

              scrollbarWidth: "thin",
              scrollbarColor: "#c0c0c0 transparent",
            }}
          >
            {items.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {title === "Son Eklenen Kitaplar"
                  ? "Henüz kitap eklenmemiş."
                  : title === "Son Onaylanan Kiralamalar"
                  ? "Henüz kiralama onayı yapılmamış."
                  : title === "Son Teslim Alınan Kitaplar"
                  ? "Henüz teslim alınan kitap yok."
                  : "Henüz öğrenci kaydı yapılmamış."}
              </Typography>
            ) : (
              <List dense sx={{ m: 0, p: 0 }}>
                {items.map(renderItem)}
              </List>
            )}
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

export default OfficerRecentActivities;
