import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import {
  fetchKategoriler,
  fetchYazarlar,
  fetchYayinevleri,
  fetchTurler,
  fetchRaflar,
  createKitap,
} from "../../../services/StudentServices/bookService";
import type {
  Kitap,
  Kategori,
  Yazar,
  Yayinevi,
  Tur,
  Raf,
} from "../../../services/StudentServices/bookTypeService";
import { useUser } from "@supabase/auth-helpers-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CreateBookDialog = ({ open, onClose }: Props) => {
  const user = useUser();

  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [yazarlar, setYazarlar] = useState<Yazar[]>([]);
  const [yayinevleri, setYayinevleri] = useState<Yayinevi[]>([]);
  const [turler, setTurler] = useState<Tur[]>([]);
  const [raflar, setRaflar] = useState<Raf[]>([]);

  const [formData, setFormData] = useState<
    Partial<Kitap> & { yeniYazar?: string }
  >({
    kitap_adi: "",
    sayfa_sayisi: undefined,
    stok_adedi: undefined,
    kapak_url: "",
    ozet: "",
    kategori_id: "",
    yayinevi_id: "",
    yazar_id: "",
    tur_id: "",
    raf_id: "",
    yeniYazar: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const [cats, yazs, yays, trs, rfs] = await Promise.all([
          fetchKategoriler(),
          fetchYazarlar(),
          fetchYayinevleri(),
          fetchTurler(),
          fetchRaflar(),
        ]);
        setKategoriler(cats);
        setYazarlar(yazs);
        setYayinevleri(yays);
        setTurler(trs);
        setRaflar(rfs);
      } catch (e) {
        console.error("Veri çekme hatası", e);
      }
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!user) {
        alert("Lütfen giriş yapınız.");
        return;
      }

      await createKitap({
        kitap_adi: formData.kitap_adi ?? "",
        sayfa_sayisi: Number(formData.sayfa_sayisi) || 0,
        stok_adedi: Number(formData.stok_adedi) || 0,
        kapak_url: formData.kapak_url || "",
        ozet: formData.ozet || "",
        kategori_id: formData.kategori_id ?? null,
        yayinevi_id: formData.yayinevi_id ?? null,
        yazar_id: formData.yazar_id ?? null,
        tur_id: formData.tur_id ?? undefined,
        raf_id: formData.raf_id ?? undefined,
        ekleyen_memur_id: user.id,
      });

      onClose(); // modalı kapat
    } catch (err) {
      console.error("Kitap ekleme hatası", err);
      alert("Kaydedilemedi");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Yeni Kitap Ekle</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid>
            <TextField
              fullWidth
              label="Kitap Adı"
              name="kitap_adi"
              value={formData.kitap_adi || ""}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Sayfa Sayısı"
              name="sayfa_sayisi"
              type="number"
              value={formData.sayfa_sayisi || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Stok Adedi"
              name="stok_adedi"
              type="number"
              value={formData.stok_adedi || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid>
            <FormControl fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select
                name="kategori_id"
                value={formData.kategori_id || ""}
                label="Kategori"
                onChange={handleChange}
              >
                {kategoriler.map((k) => (
                  <MenuItem key={k.id} value={k.id}>
                    {k.ad}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <FormControl fullWidth>
              <InputLabel>Yayınevi</InputLabel>
              <Select
                name="yayinevi_id"
                value={formData.yayinevi_id || ""}
                label="Yayınevi"
                onChange={handleChange}
              >
                {yayinevleri.map((y) => (
                  <MenuItem key={y.id} value={y.id}>
                    {y.isim}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <FormControl fullWidth>
              <InputLabel>Yazar</InputLabel>
              <Select
                name="yazar_id"
                value={formData.yazar_id || ""}
                label="Yazar"
                onChange={handleChange}
              >
                <MenuItem value="">Yeni Yazar Gir</MenuItem>
                {yazarlar.map((y) => (
                  <MenuItem key={y.id} value={y.id}>
                    {y.isim}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {!formData.yazar_id && (
              <TextField
                fullWidth
                label="Yeni Yazar İsmi"
                name="yeniYazar"
                value={formData.yeniYazar || ""}
                onChange={handleChange}
                sx={{ mt: 1 }}
              />
            )}
          </Grid>
          <Grid>
            <FormControl fullWidth>
              <InputLabel>Tür</InputLabel>
              <Select
                name="tur_id"
                value={formData.tur_id || ""}
                label="Tür"
                onChange={handleChange}
              >
                {turler.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.ad}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <FormControl fullWidth>
              <InputLabel>Raf</InputLabel>
              <Select
                name="raf_id"
                value={formData.raf_id || ""}
                label="Raf"
                onChange={handleChange}
              >
                {raflar.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.raf_no}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Kapak URL"
              name="kapak_url"
              value={formData.kapak_url || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Özet"
              name="ozet"
              value={formData.ozet || ""}
              onChange={handleChange}
              multiline
              minRows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button onClick={handleSubmit} variant="contained">
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBookDialog;
