import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { flex, styled } from '@mui/system';
import { supabase } from '../../lib/supabaseClient';

type Tur = { id: string; ad: string };
type Kategori = { id: string; ad: string };
type Kitap = {
  id: string;
  kitap_adi: string;
  sayfa_sayisi: number | null;
  stok_adedi: number | null;
  kapak_url: string | null;
  ozet: string | null;
  kategori_id: string | null;
  kategori?: Kategori;
  yayinevi_id?: string | null;
  yazar_id?: string | null;
  eklenme_tarihi?: string;
};

const StyledCard = styled(Card)({
  height: 350,
  width: 400,
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
});

function Books() {
  const [turler, setTurler] = useState<Tur[]>([]);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [selectedTur, setSelectedTur] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [kitaplar, setKitaplar] = useState<Kitap[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedKitap, setSelectedKitap] = useState<Kitap | null>(null);

  useEffect(() => {
    (async () => {
      const { data: turData } = await supabase.from('kitap_turleri').select('*');
      if (turData) setTurler(turData);

      const { data: kategoriData } = await supabase.from('kategoriler').select('*');
      if (kategoriData) setKategoriler(kategoriData);
    })();
  }, []);

  useEffect(() => {
    const fetchKitaplar = async () => {
      if (!selectedTur) return;
      setLoading(true);

      let query = supabase
        .from('kitaplar')
        .select(
          'id, kitap_adi, sayfa_sayisi, stok_adedi, kapak_url, ozet, kategori_id, kategoriler(ad), yayinevi_id, yazar_id, eklenme_tarihi'
        )
        .eq('tur_id', selectedTur);

      if (selectedKategori) query = query.eq('kategori_id', selectedKategori);
      if (search) query = query.ilike('kitap_adi', `%${search}%`);

      const { data } = await query;
      if (data) {
        const kitapWithKategori = data.map((k: any) => ({
          ...k,
          kategori: k.kategoriler,
        }));
        setKitaplar(kitapWithKategori);
      }

      setLoading(false);
    };
    fetchKitaplar();
  }, [selectedTur, selectedKategori, search]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Kitapları Filtrele
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid >
          <FormControl fullWidth>
            <Select
              value={selectedTur}
              onChange={(e) => {
                setSelectedTur(e.target.value);
                setSelectedKategori('');
              }}
              displayEmpty
            >
              <MenuItem value="" disabled>Tür Seçiniz</MenuItem>
              {turler.map((tur) => (
                <MenuItem key={tur.id} value={tur.id}>
                  {tur.ad}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid >
          <FormControl fullWidth disabled={!selectedTur}>
            <Select
              labelId="kategori-select-label"
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>Kategori Seçiniz</MenuItem>
              {kategoriler.map((kategori) => (
                <MenuItem key={kategori.id} value={kategori.id}>
                  {kategori.ad}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid >
          <TextField
            fullWidth
            label="Kitap Ara"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {kitaplar.map((kitap) => (
            <Grid  key={kitap.id}  >
              <StyledCard onClick={() => setSelectedKitap(kitap)} sx={{display:'flex', flexDirection:'row',}}>
                <img
                  src={kitap.kapak_url || 'https://via.placeholder.com/150'}
                  alt={kitap.kitap_adi}
                  style={{ width: '50%', height: '100%', objectFit: 'cover' }}
                />
                <CardContent sx={{ width:'100%'}}>
                  <Typography variant="h6">{kitap.kitap_adi}</Typography>
                  <Typography variant="h6">{kitap.yazar_id}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sayfa: {kitap.sayfa_sayisi ?? 'Bilinmiyor'} | Stok: {kitap.stok_adedi ?? 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Kategori: {kitap.kategori?.ad ?? 'Yok'}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Kitap Detay Modal */}
     <Dialog open={!!selectedKitap} onClose={() => setSelectedKitap(null)} maxWidth="md" fullWidth>
  <Box display="flex" sx={{ bgcolor: '#f5f5f5', borderRadius: 2, overflow: 'hidden' }}>
    {/* Sol: Kitap görseli */}
    <Box
      sx={{
        flex: 1,
        minHeight: 400,
        backgroundImage: `url(${selectedKitap?.kapak_url || 'https://via.placeholder.com/300x400'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />

    {/* Sağ: Kitap bilgileri */}
    <Box flex={2} p={4} position="relative">
      <IconButton
        aria-label="close"
        onClick={() => setSelectedKitap(null)}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h5" gutterBottom fontWeight="bold">
        {selectedKitap?.kitap_adi}
      </Typography>

      <Grid container spacing={2}>
        <Grid >
          <Typography variant="subtitle2" color="text.secondary">
            Sayfa Sayısı
          </Typography>
          <Typography variant="body1">{selectedKitap?.sayfa_sayisi ?? 'Bilinmiyor'}</Typography>
        </Grid>

        <Grid>
          <Typography variant="subtitle2" color="text.secondary">
            Stok Adedi
          </Typography>
          <Typography variant="body1">{selectedKitap?.stok_adedi ?? 0}</Typography>
        </Grid>

        <Grid >
          <Typography variant="subtitle2" color="text.secondary">
            Kategori
          </Typography>
          <Typography variant="body1">{selectedKitap?.kategori?.ad ?? 'Yok'}</Typography>
        </Grid>

        <Grid >
          <Typography variant="subtitle2" color="text.secondary">
            Eklenme Tarihi
          </Typography>
          <Typography variant="body1">
            {selectedKitap?.eklenme_tarihi?.split('T')[0] ?? 'Yok'}
          </Typography>
        </Grid>

        <Grid >
          <Typography variant="subtitle2" color="text.secondary">
            Yayınevi ID
          </Typography>
          <Typography variant="body1">{selectedKitap?.yayinevi_id ?? 'Yok'}</Typography>
        </Grid>

        <Grid >
          <Typography variant="subtitle2" color="text.secondary">
            Yazar ID
          </Typography>
          <Typography variant="body1">{selectedKitap?.yazar_id ?? 'Yok'}</Typography>
        </Grid>

        <Grid >
          <Typography variant="subtitle2" color="text.secondary">
            Özet
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {selectedKitap?.ozet ?? 'Özet bulunamadı.'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  </Box>
</Dialog>

    </Box>
  );
}

export default Books;
