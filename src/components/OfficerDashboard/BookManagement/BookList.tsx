import React, { useEffect, useState } from "react";
import { fetchKitaplar } from "../../../services/StudentServices/bookService";
import type { Kitap } from "../../../services/StudentServices/bookTypeService";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";

const BookList = () => {
  const [kitaplar, setKitaplar] = useState<Kitap[]>([]);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    const kitaplariGetir = async () => {
      try {
        const data = await fetchKitaplar(); // Filtre olmadan tüm kitapları getirir
        setKitaplar(data);
      } catch (error: any) {
        setHata("Kitaplar alınırken bir hata oluştu.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    kitaplariGetir();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (hata) {
    return (
      <Typography color="error" textAlign="center" mt={4}>
        {hata}
      </Typography>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Kitaplar
      </Typography>
      <Grid container spacing={3}>
        {kitaplar.map((kitap) => (
          <Grid key={kitap.id}>
            <Card sx={{ height: "100%" }}>
              {kitap.kapak_url && (
                <CardMedia
                  component="img"
                  height="200"
                  image={kitap.kapak_url}
                  alt={kitap.kitap_adi}
                />
              )}
              <CardContent>
                <Typography variant="h6">{kitap.kitap_adi}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Sayfa Sayısı: {kitap.sayfa_sayisi}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stok: {kitap.stok_adedi}
                </Typography>
                {kitap.ozet && (
                  <Typography variant="body2" mt={1}>
                    {kitap.ozet.slice(0, 100)}...
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BookList;
