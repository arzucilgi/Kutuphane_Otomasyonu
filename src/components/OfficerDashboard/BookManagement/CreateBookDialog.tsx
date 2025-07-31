import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Stack,
  Box,
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
import { toast } from "react-toastify";

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

  const [filteredRaflar, setFilteredRaflar] = useState<Raf[]>([]);

  const [formData, setFormData] = useState<Partial<Kitap>>({
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

        // Başlangıçta tüm raflar gösterilsin
        setFilteredRaflar(rfs);
      } catch (e) {
        console.error("Veri çekme hatası", e);
      }
    })();
  }, []);

  // Kategori değiştikçe rafları filtrele
  useEffect(() => {
    console.log("Kategori ID:", formData.kategori_id);
    console.log("Tüm Raflar:", raflar);

    if (!formData.kategori_id) {
      setFilteredRaflar(raflar);
    } else {
      const filtreli = raflar.filter((raf) => {
        console.log(
          "raf.kategori_id:",
          raf.kategori_id,
          "===",
          formData.kategori_id
        );
        return raf.kategori_id?.toString() === formData.kategori_id?.toString();
      });

      console.log("Filtreli Raflar:", filtreli);

      setFilteredRaflar(filtreli);

      if (!filtreli.find((r) => r.id === formData.raf_id)) {
        setFormData((prev) => ({ ...prev, raf_id: "" }));
      }
    }
  }, [formData.kategori_id, raflar]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Lütfen giriş yapınız.");
      return;
    }

    try {
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

      toast.success("Kitap başarıyla eklendi.");
      onClose();
    } catch (err) {
      console.error("Kitap ekleme hatası", err);
      toast.error("Kitap eklenemedi, lütfen tekrar deneyiniz.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.4rem" }}>
        📘 Yeni Kitap Ekle
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: "#f9f9f9", py: 3 }}>
        <Stack spacing={3}>
          <TextField
            label="Kitap Adı"
            name="kitap_adi"
            value={formData.kitap_adi || ""}
            onChange={handleChange}
            fullWidth
            required
          />

          <Box display="flex" gap={2}>
            <TextField
              label="Sayfa Sayısı"
              name="sayfa_sayisi"
              type="number"
              value={formData.sayfa_sayisi || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Stok Adedi"
              name="stok_adedi"
              type="number"
              value={formData.stok_adedi || ""}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          <Box display="flex" gap={2}>
            <Autocomplete
              options={kategoriler}
              getOptionLabel={(option) => option.ad}
              value={
                kategoriler.find((k) => k.id === formData.kategori_id) || null
              }
              onChange={(_, value) =>
                setFormData((prev) => ({
                  ...prev,
                  kategori_id: value?.id ?? "",
                  raf_id: "", // Kategori değişince raf seçimi sıfırlanır
                }))
              }
              renderInput={(params) => (
                <TextField {...params} label="Kategori" />
              )}
              fullWidth
            />
            <Autocomplete
              options={yayinevleri}
              getOptionLabel={(option) => option.isim}
              value={
                yayinevleri.find((y) => y.id === formData.yayinevi_id) || null
              }
              onChange={(_, value) => {
                setFormData((prev) => ({
                  ...prev,
                  yayinevi_id: value?.id ?? "",
                }));
              }}
              renderInput={(params) => (
                <TextField {...params} label="Yayınevi" />
              )}
              fullWidth
            />
          </Box>

          <Box display="flex" gap={2}>
            <Autocomplete
              options={yazarlar}
              getOptionLabel={(option) => option.isim}
              onChange={(_, value) =>
                setFormData((prev) => ({
                  ...prev,
                  yazar_id: value?.id ?? "",
                }))
              }
              renderInput={(params) => <TextField {...params} label="Yazar" />}
              fullWidth
            />
            <Autocomplete
              options={turler}
              getOptionLabel={(option) => option.ad}
              onChange={(_, value) =>
                setFormData((prev) => ({
                  ...prev,
                  tur_id: value?.id ?? "",
                }))
              }
              renderInput={(params) => <TextField {...params} label="Tür" />}
              fullWidth
            />
          </Box>

          <Autocomplete
            options={filteredRaflar}
            getOptionLabel={(option) => option.raf_no}
            value={filteredRaflar.find((r) => r.id === formData.raf_id) || null}
            onChange={(_, value) =>
              setFormData((prev) => ({
                ...prev,
                raf_id: value?.id ?? "",
              }))
            }
            renderInput={(params) => <TextField {...params} label="Raf" />}
            fullWidth
          />

          <TextField
            label="Kapak URL"
            name="kapak_url"
            value={formData.kapak_url || ""}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Özet"
            name="ozet"
            value={formData.ozet || ""}
            onChange={handleChange}
            multiline
            minRows={4}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="primary">
          İptal
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: " #4caf50",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#64dd17",
            },
          }}
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBookDialog;
