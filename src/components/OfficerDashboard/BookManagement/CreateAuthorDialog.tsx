import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Alert,
  TextField,
  Autocomplete,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Yazar {
  id: string;
  isim: string;
  ozgecmis: string | null;
  profil_resim_url: string | null;
}

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onCancel}>
    {title && <DialogTitle>{title}</DialogTitle>}
    <DialogContent>
      <Typography>{message}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>Hayır</Button>
      <Button onClick={onConfirm} color="primary" variant="contained">
        Evet
      </Button>
    </DialogActions>
  </Dialog>
);

const AuthorManagerDialog = ({ open, onClose }: Props) => {
  const [mode, setMode] = useState<"none" | "create" | "update" | "delete">(
    "none"
  );
  const [yazarlar, setYazarlar] = useState<Yazar[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState({
    ad: "",
    soyad: "",
    ozgecmis: "",
    profil: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    msg: string;
  } | null>(null);

  // Confirm dialog kontrolü
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmCallback, setConfirmCallback] = useState<() => void>(() => {});

  const clearForm = () => {
    setForm({ ad: "", soyad: "", ozgecmis: "", profil: "" });
    setSelectedId("");
    setMode("none");
  };

  const fetchYazarlar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("yazarlar")
      .select("*")
      .order("isim");
    if (error) {
      setFeedback({ type: "error", msg: error.message });
    } else {
      setYazarlar(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      setMode("none");
      clearForm();
      setFeedback(null);
      fetchYazarlar();
    }
  }, [open]);

  // Confirm dialogu açma fonksiyonu
  const openConfirm = (message: string, callback: () => void) => {
    setConfirmMessage(message);
    setConfirmCallback(() => () => {
      callback();
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  // CRUD işlemleri fonksiyonları, confirm dialog ile kontrol edilecek

  const handleCreate = () => {
    if (!form.ad || !form.soyad) {
      setFeedback({ type: "error", msg: "Ad ve soyad zorunludur." });
      return;
    }

    openConfirm("Bu yazarı eklemek istediğinize emin misiniz?", async () => {
      const isim = `${form.ad} ${form.soyad}`;
      const { error } = await supabase.from("yazarlar").insert({
        isim,
        ozgecmis: form.ozgecmis || null,
        profil_resim_url: form.profil || null,
      });

      if (error) {
        setFeedback({ type: "error", msg: error.message });
      } else {
        setFeedback({ type: "success", msg: "Yazar başarıyla eklendi." });
        clearForm();
        fetchYazarlar();
      }
    });
  };

  const handleUpdate = () => {
    if (!selectedId) return;

    openConfirm(
      "Bu yazarı güncellemek istediğinize emin misiniz?",
      async () => {
        const isim = `${form.ad} ${form.soyad}`;
        const { error } = await supabase
          .from("yazarlar")
          .update({
            isim,
            ozgecmis: form.ozgecmis || null,
            profil_resim_url: form.profil || null,
          })
          .eq("id", selectedId);

        if (error) {
          setFeedback({ type: "error", msg: error.message });
        } else {
          setFeedback({ type: "success", msg: "Yazar güncellendi." });
          clearForm();
          fetchYazarlar();
        }
      }
    );
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    // Önce yazarın kitaplarını kontrol et
    const { data: kitaplar, error: kitapError } = await supabase
      .from("kitaplar")
      .select("id")
      .eq("yazar_id", selectedId);

    if (kitapError) {
      setFeedback({ type: "error", msg: kitapError.message });
      return;
    }

    if (kitaplar && kitaplar.length > 0) {
      setFeedback({
        type: "error",
        msg: "Bu yazara ait kitaplar var. Önce kitapları silmelisiniz.",
      });
      return;
    }

    // Eğer kitap yoksa, silme için onay al
    openConfirm("Bu yazarı silmek istediğinize emin misiniz?", async () => {
      const { error } = await supabase
        .from("yazarlar")
        .delete()
        .eq("id", selectedId);

      if (error) {
        setFeedback({ type: "error", msg: error.message });
      } else {
        setFeedback({ type: "success", msg: "Yazar silindi." });
        clearForm();
        fetchYazarlar();
      }
    });
  };

  const handleYazarChange = (id: string) => {
    const yazar = yazarlar.find((y) => y.id === id);
    if (yazar) {
      const [first, ...rest] = yazar.isim.split(" ");
      setForm({
        ad: first || "",
        soyad: rest.join(" ") || "",
        ozgecmis: yazar.ozgecmis || "",
        profil: yazar.profil_resim_url || "",
      });
      setSelectedId(id);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Yazar İşlemleri</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {feedback && <Alert severity={feedback.type}>{feedback.msg}</Alert>}

            <Stack direction="row" spacing={1}>
              <Button
                onClick={() => setMode("create")}
                variant={mode === "create" ? "contained" : "outlined"}
              >
                Ekle
              </Button>
              <Button
                onClick={() => setMode("update")}
                variant={mode === "update" ? "contained" : "outlined"}
              >
                Güncelle
              </Button>
              <Button
                onClick={() => setMode("delete")}
                variant={mode === "delete" ? "contained" : "outlined"}
              >
                Sil
              </Button>
            </Stack>

            {(mode === "update" || mode === "delete") && (
              <Autocomplete
                options={yazarlar}
                getOptionLabel={(option) => option.isim}
                filterSelectedOptions
                value={yazarlar.find((y) => y.id === selectedId) || null}
                onChange={(_, newValue) => {
                  if (newValue) {
                    handleYazarChange(newValue.id);
                  } else {
                    setSelectedId("");
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Yazar Seç / Ara" />
                )}
              />
            )}

            {(mode === "create" || mode === "update") && (
              <>
                <TextField
                  label="Ad"
                  value={form.ad}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, ad: e.target.value }))
                  }
                />
                <TextField
                  label="Soyad"
                  value={form.soyad}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, soyad: e.target.value }))
                  }
                />
                <TextField
                  label="Özgeçmiş"
                  multiline
                  minRows={3}
                  value={form.ozgecmis}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, ozgecmis: e.target.value }))
                  }
                />
                <TextField
                  label="Profil Resmi URL"
                  value={form.profil}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, profil: e.target.value }))
                  }
                />
              </>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Kapat</Button>
          {mode === "create" && (
            <Button onClick={handleCreate} variant="contained">
              Ekle
            </Button>
          )}
          {mode === "update" && selectedId && (
            <Button onClick={handleUpdate} variant="contained">
              Güncelle
            </Button>
          )}
          {mode === "delete" && selectedId && (
            <Button onClick={handleDelete} variant="outlined" color="error">
              Sil
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        message={confirmMessage}
        onConfirm={confirmCallback}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default AuthorManagerDialog;
