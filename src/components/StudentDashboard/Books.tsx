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
  Dialog,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";

import {
  fetchTurler,
  fetchKategoriler,
  fetchYazarlar,
  fetchYayinevleri,
  fetchKitaplar,
} from "../../services/bookService"; // Yeni servislerin yolu

import {
  type Tur,
  type Kategori,
  type Yazar,
  type Yayinevi,
  type Kitap,
} from "../../services/bookTypeService";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)({
  height: 300,
  width: 350,
  display: "flex",
  flexDirection: "row",
  cursor: "pointer",
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

  const navigate = useNavigate();

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    (async () => {
      try {
        const [turData, kategoriData, yazarData, yayineviData] =
          await Promise.all([
            fetchTurler(),
            fetchKategoriler(),
            fetchYazarlar(),
            fetchYayinevleri(),
          ]);
        setTurler(turData);
        setKategoriler(kategoriData);
        setYazarlar(yazarData);
        setYayinevleri(yayineviData);
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
          search: search || undefined,
        });

        // Kategoriyi ilişkilendir (kategoriler tablosundan)
        const kitapWithRelations = data.map((k) => ({
          ...k,
          kategori: kategoriler.find((cat) => cat.id === k.kategori_id),
          yazar: yazarlar.find((y) => y.id === k.yazar_id),
          yayinevi: yayinevleri.find((y) => y.id === k.yayinevi_id),
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
        p: 4,
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
          {pagedKitaplar.map((kitap) => (
            <Grid key={kitap.id}>
              <StyledCard onClick={() => setSelectedKitap(kitap)}>
                <img
                  src={kitap.kapak_url || "https://via.placeholder.com/150"}
                  alt={kitap.kitap_adi}
                  style={{
                    width: "50%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <CardContent sx={{ width: "100%" }}>
                  <Typography variant="h6">{kitap.kitap_adi}</Typography>
                  <Typography variant="subtitle1">
                    {kitap.yazar?.isim ?? "Yazar bilgisi yok"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sayfa: {kitap.sayfa_sayisi ?? "Bilinmiyor"} | Stok:{" "}
                    {kitap.stok_adedi ?? 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Kategori: {kitap.kategori?.ad ?? "Yok"}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
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

      {/* Kitap detay modal */}
      <Dialog
        open={!!selectedKitap}
        onClose={() => setSelectedKitap(null)}
        maxWidth="md"
        fullWidth
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          sx={{ bgcolor: "#fafafa", borderRadius: 2, overflow: "hidden" }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "40%" },
              minHeight: 400,
              backgroundImage: `url(${
                selectedKitap?.kapak_url ||
                "https://via.placeholder.com/300x400"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <Box flex={1} p={4} position="relative">
            <IconButton
              aria-label="close"
              onClick={() => setSelectedKitap(null)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {selectedKitap?.kitap_adi}
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Yazar
                </Typography>
                <Typography variant="body1">
                  {selectedKitap?.yazar?.isim ?? "Yazar bilgisi yok"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Yayınevi
                </Typography>
                <Typography variant="body1">
                  {selectedKitap?.yayinevi?.isim ?? "Yayınevi bilgisi yok"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Sayfa Sayısı
                </Typography>
                <Typography variant="body1">
                  {selectedKitap?.sayfa_sayisi ?? "Bilinmiyor"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Stok
                </Typography>
                <Typography variant="body1">
                  {selectedKitap?.stok_adedi ?? 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Kategori
                </Typography>
                <Typography variant="body1">
                  {selectedKitap?.kategori?.ad ?? "Yok"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Eklenme Tarihi
                </Typography>
                <Typography variant="body1">
                  {selectedKitap?.eklenme_tarihi?.split("T")[0] ?? "Yok"}
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Özet
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {selectedKitap?.ozet ?? "Özet bulunamadı."}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                  onClick={() =>
                    navigate("/studentDashboard/rentBook", {
                      state: { kitap: selectedKitap },
                    })
                  }
                >
                  Hızlı Ödünç Al
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

export default Books;
