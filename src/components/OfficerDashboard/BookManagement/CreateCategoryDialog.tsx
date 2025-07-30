import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Autocomplete,
  Alert,
  Typography,
  Box,
} from "@mui/material";
import { supabase } from "../../../lib/supabaseClient";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Kategori {
  id: string;
  ad: string;
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

const CreateCategoryDialog: React.FC<Props> = ({ open, onClose }) => {
  const [mode, setMode] = useState<"none" | "create" | "update" | "delete">(
    "none"
  );

  const [kategoriAdi, setKategoriAdi] = useState("");
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    msg: string;
  } | null>(null);

  // Confirm dialog state ve callback
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmCallback, setConfirmCallback] = useState<() => void>(() => {});

  const clearForm = () => {
    setKategoriAdi("");
    setEditValue("");
    setSelectedId(null);
    setMode("none");
    // setFeedback(null);
  };

  const fetchKategoriler = async () => {
    const { data, error } = await supabase
      .from("kategoriler")
      .select("*")
      .order("ad");
    if (!error && data) {
      setKategoriler(data);
    } else if (error) {
      setFeedback({ type: "error", msg: error.message });
    }
  };

  useEffect(() => {
    if (open) {
      clearForm();
      fetchKategoriler();
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

  // CRUD işlemleri

  const handleCreate = () => {
    if (!kategoriAdi.trim()) {
      setFeedback({ type: "error", msg: "Kategori adı boş olamaz." });
      return;
    }

    openConfirm(
      "Bu kategoriyi eklemek istediğinize emin misiniz?",
      async () => {
        setLoading(true);

        const { error } = await supabase
          .from("kategoriler")
          .insert({ ad: kategoriAdi.trim() });

        setLoading(false);

        if (error) {
          setFeedback({ type: "error", msg: error.message });
        } else {
          setFeedback({ type: "success", msg: "Kategori başarıyla eklendi." });
          clearForm();
          fetchKategoriler();
        }
      }
    );
  };

  const handleUpdate = () => {
    if (!selectedId || !editValue.trim()) {
      setFeedback({
        type: "error",
        msg: "Güncellemek için kategori seçmeli ve ad boş olmamalı.",
      });
      return;
    }

    openConfirm(
      "Bu kategoriyi güncellemek istediğinize emin misiniz?",
      async () => {
        setLoading(true);

        const { error } = await supabase
          .from("kategoriler")
          .update({ ad: editValue.trim() })
          .eq("id", selectedId);

        setLoading(false);

        if (error) {
          setFeedback({ type: "error", msg: error.message });
        } else {
          setFeedback({
            type: "success",
            msg: "Kategori başarıyla güncellendi.",
          });
          clearForm();
          fetchKategoriler();
        }
      }
    );
  };

  const handleDelete = async () => {
    if (!selectedId) {
      setFeedback({ type: "error", msg: "Silmek için kategori seçmelisiniz." });
      return;
    }

    setLoading(true);

    // 1. Bu kategoriye bağlı kitap var mı?
    const { data: kitaplar, error: kitapError } = await supabase
      .from("kitaplar")
      .select("id")
      .eq("kategori_id", selectedId);

    if (kitapError) {
      setLoading(false);
      setFeedback({ type: "error", msg: "Kitap kontrolü yapılamadı." });
      return;
    }

    if (kitaplar && kitaplar.length > 0) {
      setLoading(false);
      setFeedback({
        type: "error",
        msg: "Bu kategoriye ait kitaplar var. Lütfen önce o kitapları silin veya taşıyın.",
      });
      return;
    }

    // 2. Bu kategoriye bağlı raf var mı?
    const { data: raflar, error: rafError } = await supabase
      .from("raflar")
      .select("id")
      .eq("kategori_id", selectedId); // Eğer kategori_id yoksa bu kısmı kaldırabilirsin

    if (rafError) {
      setLoading(false);
      setFeedback({ type: "error", msg: "Raf kontrolü yapılamadı." });
      return;
    }

    if (raflar && raflar.length > 0) {
      setLoading(false);
      setFeedback({
        type: "error",
        msg: "Bu kategoriye bağlı raflar var. Önce rafları silmelisiniz.",
      });
      return;
    }

    // 3. Silme onayı
    setLoading(false);
    openConfirm("Bu kategoriyi silmek istediğinize emin misiniz?", async () => {
      setLoading(true);
      const { error } = await supabase
        .from("kategoriler")
        .delete()
        .eq("id", selectedId);
      setLoading(false);

      if (error) {
        setFeedback({ type: "error", msg: error.message });
      } else {
        setFeedback({ type: "success", msg: "Kategori başarıyla silindi." });
        clearForm();
        fetchKategoriler();
      }
    });
  };

  // Seçim değişimi
  const handleKategoriChange = (id: string | null) => {
    if (!id) {
      clearForm();
      return;
    }
    const kategori = kategoriler.find((k) => k.id === id);
    if (kategori) {
      setSelectedId(kategori.id);
      setEditValue(kategori.ad);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Kategori İşlemleri</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {feedback && <Alert severity={feedback.type}>{feedback.msg}</Alert>}

            <Stack direction="row" spacing={1}>
              <Button
                onClick={() => {
                  clearForm();
                  setMode("create");
                }}
                variant={mode === "create" ? "contained" : "outlined"}
              >
                Ekle
              </Button>
              <Button
                onClick={() => {
                  clearForm();
                  setMode("update");
                }}
                variant={mode === "update" ? "contained" : "outlined"}
              >
                Güncelle
              </Button>
              <Button
                onClick={() => {
                  clearForm();
                  setMode("delete");
                }}
                variant={mode === "delete" ? "contained" : "outlined"}
              >
                Sil
              </Button>
            </Stack>

            {(mode === "update" || mode === "delete") && (
              <Autocomplete
                options={kategoriler}
                getOptionLabel={(option) => option.ad}
                filterSelectedOptions
                value={kategoriler.find((k) => k.id === selectedId) || null}
                onChange={(_, newValue) => {
                  if (newValue) handleKategoriChange(newValue.id);
                  else handleKategoriChange(null);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Kategori Seç / Ara" />
                )}
              />
            )}

            {(mode === "create" || mode === "update") && (
              <TextField
                label={mode === "create" ? "Yeni Kategori Adı" : "Kategori Adı"}
                value={mode === "create" ? kategoriAdi : editValue}
                onChange={(e) =>
                  mode === "create"
                    ? setKategoriAdi(e.target.value)
                    : setEditValue(e.target.value)
                }
                fullWidth
                sx={{ mt: 1 }}
              />
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Kapat
          </Button>
          {mode === "create" && (
            <Button
              onClick={handleCreate}
              variant="contained"
              disabled={loading}
            >
              Ekle
            </Button>
          )}
          {mode === "update" && (
            <Button
              onClick={handleUpdate}
              variant="contained"
              disabled={loading || !selectedId}
            >
              Güncelle
            </Button>
          )}
          {mode === "delete" && (
            <Button
              onClick={handleDelete}
              variant="outlined"
              color="error"
              disabled={loading || !selectedId}
            >
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

export default CreateCategoryDialog;
