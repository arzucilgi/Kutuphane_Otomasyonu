import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { styled } from "@mui/system";

import {
  fetchTurler,
  fetchKategoriler,
  fetchYazarlar,
  fetchYayinevleri,
  fetchKitaplar,
  fetchRaflar,
} from "../../services/StudentServices/bookService";

import {
  type Tur,
  type Kategori,
  type Yazar,
  type Yayinevi,
  type Kitap,
  type Raf,
} from "../../services/StudentServices/bookTypeService";

import {
  toggleFavoriteBook,
  fetchUserFavorites,
} from "../../services/StudentServices/FavoriteService";
import { supabase } from "../../lib/supabaseClient";
import BookDetailDialog from "../StudentDashboard/BookDetailDialog";

// Stil tanımlamaları
const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 330,
  height: "330px",
  display: "flex",
  flexDirection: "row",
  cursor: "pointer",
  position: "relative",
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    height: "auto",
  },
}));

const CoverWrapper = styled("div")({
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  borderTopLeftRadius: 12,
  borderBottomLeftRadius: 12,
});

const CoverImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
});

const ContentWrapper = styled(CardContent)({
  width: "55%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "16px 20px",
  gap: "8px",
  overflow: "hidden",
});

const FavoriteButton = styled(IconButton)({
  position: "absolute",
  top: 8,
  right: 8,
  zIndex: 10,
  backgroundColor: "rgba(247, 247, 247, 0.85)",
  "&:hover": {
    backgroundColor: "rgba(234, 234, 234, 1)",
  },
});

function Books() {
  const [turler, setTurler] = useState<Tur[]>([]);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [yazarlar, setYazarlar] = useState<Yazar[]>([]);
  const [yayinevleri, setYayinevleri] = useState<Yayinevi[]>([]);
  const [selectedTur, setSelectedTur] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [kitaplar, setKitaplar] = useState<Kitap[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedKitap, setSelectedKitap] = useState<Kitap | null>(null);
  const [userFavorites, setUserFavorites] = useState<string[]>([]); // favori kitap id'leri
  const [raflar, setRaflar] = useState<Raf[]>([]);
  const [selectedYazar, setSelectedYazar] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Kullanıcıyı al ve favorilerini getir
  useEffect(() => {
    const fetchFavorites = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setUserFavorites([]);
        return;
      }

      try {
        const favs = await fetchUserFavorites(user.id);
        setUserFavorites(favs); // Zaten string[] dönüyor
      } catch (e) {
        console.error("Favori kitaplar alınamadı:", e);
        setUserFavorites([]);
      }
    };

    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (e: React.MouseEvent, kitapId: string) => {
    e.stopPropagation(); // Kartın onClick olayını engelle

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Kullanıcı bilgisi alınamadı:", error?.message);
      return;
    }

    const user_id = user.id;

    const result = await toggleFavoriteBook(user_id, kitapId);

    if (result.success) {
      if (result.status === "added") {
        setUserFavorites((prev) => [...prev, kitapId]);
      } else if (result.status === "removed") {
        setUserFavorites((prev) => prev.filter((id) => id !== kitapId));
      }
    } else {
      console.error("Favori işlemi başarısız:", result.message);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const [turData, kategoriData, yazarData, yayineviData, rafData] =
          await Promise.all([
            fetchTurler(),
            fetchKategoriler(),
            fetchYazarlar(),
            fetchYayinevleri(),
            fetchRaflar(), // <-- bunu ekledik
          ]);
        setTurler(turData);
        setKategoriler(kategoriData);
        setYazarlar(yazarData);
        setYayinevleri(yayineviData);
        setRaflar(rafData); // <-- bu da
      } catch (error) {
        console.error("Veri çekilirken hata:", error);
      }
    })();
  }, []);

  useEffect(() => {
    const loadKitaplar = async () => {
      if (yazarlar.length === 0 || yayinevleri.length === 0) return;

      setLoading(true);

      try {
        const data = await fetchKitaplar({
          turId: selectedTur || undefined,
          kategoriId: selectedKategori || undefined,
          yazarId: selectedYazar || undefined, // YENİ
          search: search || undefined,
        });

        const kitapWithRelations = data.map((k) => ({
          ...k,
          kategori: kategoriler.find((cat) => cat.id === k.kategori_id),
          yazar: yazarlar.find((y) => y.id === k.yazar_id),
          yayinevi: yayinevleri.find((y) => y.id === k.yayinevi_id),
          raf: raflar.find((r) => r.id === k.raf_id),
        }));

        setKitaplar(kitapWithRelations);
        setPage(1);
      } catch (error) {
        console.error("Kitaplar yüklenirken hata:", error);
        setKitaplar([]);
      }

      setLoading(false);
    };

    loadKitaplar();
  }, [
    selectedTur,
    selectedKategori,
    selectedYazar, // YENİ
    search,
    yazarlar,
    yayinevleri,
    kategoriler,
  ]);

  const startIndex = (page - 1) * itemsPerPage;
  const pagedKitaplar = kitaplar.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(kitaplar.length / itemsPerPage);

  return (
    <Box
      sx={{
        margin: "20px auto",
        border: "1px solid #ccc",
        borderRadius: 2,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Filtreler */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <FormControl sx={{ minWidth: 150, flex: "1 1 200px" }}>
          <Select
            value={selectedTur}
            onChange={(e) => {
              setSelectedTur(e.target.value);
              setSelectedKategori("");
            }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Tür Seçiniz
            </MenuItem>
            {turler.map((tur) => (
              <MenuItem key={tur.id} value={tur.id}>
                {tur.ad}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{ minWidth: 150, flex: "1 1 200px" }}
          disabled={!selectedTur}
        >
          <Select
            value={selectedKategori}
            onChange={(e) => setSelectedKategori(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Kategori Seçiniz
            </MenuItem>
            {kategoriler.map((kategori) => (
              <MenuItem key={kategori.id} value={kategori.id}>
                {kategori.ad}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150, flex: "1 1 200px" }}>
          <Select
            value={selectedYazar}
            onChange={(e) => setSelectedYazar(e.target.value)}
            displayEmpty
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 6 + 8,
                  width: 250,
                },
              },
            }}
          >
            <MenuItem value="">Tüm Yazarlar</MenuItem>
            {yazarlar.map((yazar) => (
              <MenuItem key={yazar.id} value={yazar.id}>
                {yazar.isim}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Kitap Ara"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: "1 1 300px", minWidth: 150 }}
        />
      </Box>

      {/* Kitaplar */}
      {loading ? (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : pagedKitaplar.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 4, textAlign: "center" }}>
          Kayıtlı kitap bulunamadı.
        </Typography>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {pagedKitaplar.map((kitap) => {
            const isFavorited = userFavorites.includes(kitap.id);
            return (
              <Grid key={kitap.id}>
                <StyledCard onClick={() => setSelectedKitap(kitap)}>
                  <CoverWrapper>
                    <CoverImage
                      src={kitap.kapak_url || "https://via.placeholder.com/150"}
                      alt={kitap.kitap_adi}
                    />
                  </CoverWrapper>

                  <ContentWrapper>
                    <FavoriteButton
                      onClick={(e) => handleToggleFavorite(e, kitap.id)}
                      aria-label={
                        isFavorited ? "Favorilerden kaldır" : "Favorilere ekle"
                      }
                      size="large"
                    >
                      {isFavorited ? (
                        <FavoriteIcon color="error" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </FavoriteButton>
                    <Typography
                      variant="h6"
                      fontWeight={"bold"}
                      // noWrap
                      title={kitap.kitap_adi}
                    >
                      {kitap.kitap_adi}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      noWrap
                      title={kitap.yazar?.isim}
                    >
                      {kitap.yazar?.isim ?? "Yazar bilgisi yok"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      Sayfa: {kitap.sayfa_sayisi ?? "Bilinmiyor"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      Stok: {kitap.stok_adedi ?? 0}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      title={kitap.kategori?.ad}
                    >
                      Kategori: {kitap.kategori?.ad ?? "Yok"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      title={kitap.raf?.raf_no}
                    >
                      Raf Numarası: {kitap.raf?.raf_no}
                    </Typography>
                  </ContentWrapper>
                </StyledCard>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 2,
          mb: 1,
          flexShrink: 0,
        }}
      >
        <Button
          variant="contained"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Geri
        </Button>
        <Typography variant="body1" sx={{ alignSelf: "center" }}>
          {page} / {totalPages || 1}
        </Typography>
        <Button
          variant="contained"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          İleri
        </Button>
      </Box>

      <BookDetailDialog
        open={!!selectedKitap}
        onClose={() => setSelectedKitap(null)}
        kitap={selectedKitap}
      />
    </Box>
  );
}

export default Books;
