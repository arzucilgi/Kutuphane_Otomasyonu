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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Kategori {
  id: string;
  ad: string;
}

interface Raf {
  id: string;
  kategori_id: string;
  raf_no: string;
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

const ShelfManagerDialog = ({ open, onClose }: Props) => {
  const [mode, setMode] = useState<"none" | "create" | "update" | "delete">(
    "none"
  );
  const [raflar, setRaflar] = useState<Raf[]>([]);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [form, setForm] = useState({
    kategori_id: "",
    raf_no: "",
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
    setForm({ kategori_id: "", raf_no: "" });
    setSelectedId("");
    setMode("none");
  };

  const fetchData = async () => {
    setLoading(true);
    // setFeedback(null);

    const { data: katData, error: katError } = await supabase
      .from("kategoriler")
      .select("*")
      .order("ad");
    if (katError) {
      setFeedback({ type: "error", msg: katError.message });
      setLoading(false);
      return;
    }
    setKategoriler(katData || []);

    const { data: rafData, error: rafError } = await supabase
      .from("raflar")
      .select("*")
      .order("raf_no");
    if (rafError) {
      setFeedback({ type: "error", msg: rafError.message });
      setLoading(false);
      return;
    }
    setRaflar(rafData || []);

    clearForm();
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const openConfirm = (message: string, callback: () => void) => {
    setConfirmMessage(message);
    setConfirmCallback(() => () => {
      callback();
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  // Raf seçildiğinde formu doldur
  const handleRafChange = (id: string) => {
    const raf = raflar.find((r) => r.id === id);
    if (raf) {
      setForm({
        kategori_id: raf.kategori_id,
        raf_no: raf.raf_no,
      });
      setSelectedId(id);
    } else {
      // Seçim boşsa formu temizle
      setForm({ kategori_id: "", raf_no: "" });
      setSelectedId("");
    }
  };

  // CRUD işlemleri

  const handleCreate = () => {
    if (!form.kategori_id) {
      setFeedback({ type: "error", msg: "Kategori seçmelisiniz." });
      return;
    }
    if (!form.raf_no.trim()) {
      setFeedback({ type: "error", msg: "Raf adı boş olamaz." });
      return;
    }

    openConfirm("Bu rafı eklemek istediğinize emin misiniz?", async () => {
      setLoading(true);
      const { error } = await supabase.from("raflar").insert({
        kategori_id: form.kategori_id,
        raf_no: form.raf_no.trim(),
      });
      setLoading(false);

      if (error) {
        setFeedback({ type: "error", msg: error.message });
      } else {
        setFeedback({ type: "success", msg: "Raf başarıyla eklendi." });
        fetchData();
      }
    });
  };

  const handleUpdate = () => {
    if (!selectedId) return;
    if (!form.kategori_id) {
      setFeedback({ type: "error", msg: "Kategori seçmelisiniz." });
      return;
    }
    if (!form.raf_no.trim()) {
      setFeedback({ type: "error", msg: "Raf adı boş olamaz." });
      return;
    }

    openConfirm("Bu rafı güncellemek istediğinize emin misiniz?", async () => {
      setLoading(true);
      const { error } = await supabase
        .from("raflar")
        .update({
          kategori_id: form.kategori_id,
          raf_no: form.raf_no.trim(),
        })
        .eq("id", selectedId);
      setLoading(false);

      if (error) {
        setFeedback({ type: "error", msg: error.message });
      } else {
        setFeedback({ type: "success", msg: "Raf güncellendi." });
        fetchData();
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    // 1. Bu rafta kitap var mı kontrolü
    setLoading(true);
    const { data: kitaplar, error: kitapError } = await supabase
      .from("kitaplar")
      .select("id")
      .eq("raf_id", selectedId);

    setLoading(false);

    if (kitapError) {
      setFeedback({
        type: "error",
        msg: "Kitap kontrolü yapılırken hata oluştu.",
      });
      return;
    }

    if (kitaplar && kitaplar.length > 0) {
      setFeedback({
        type: "error",
        msg: "Bu rafta kayıtlı kitaplar var. Lütfen önce o kitapları taşıyın veya silin.",
      });
      return;
    }

    // 2. Silme işlemi için onay
    openConfirm("Bu rafı silmek istediğinize emin misiniz?", async () => {
      setLoading(true);
      const { error } = await supabase
        .from("raflar")
        .delete()
        .eq("id", selectedId);
      setLoading(false);

      if (error) {
        setFeedback({ type: "error", msg: error.message });
      } else {
        setFeedback({ type: "success", msg: "Raf silindi." });
        fetchData();
      }
    });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Raf İşlemleri</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {feedback && <Alert severity={feedback.type}>{feedback.msg}</Alert>}
            {loading && <CircularProgress size={24} />}

            <Stack direction="row" spacing={1}>
              <Button
                onClick={() => {
                  clearForm();
                  setMode("create");
                }}
                variant={mode === "create" ? "contained" : "outlined"}
                disabled={loading}
              >
                Ekle
              </Button>
              <Button
                onClick={() => setMode("update")}
                variant={mode === "update" ? "contained" : "outlined"}
                disabled={loading}
              >
                Güncelle
              </Button>
              <Button
                onClick={() => setMode("delete")}
                variant={mode === "delete" ? "contained" : "outlined"}
                disabled={loading}
              >
                Sil
              </Button>
            </Stack>

            {(mode === "update" || mode === "delete") && (
              <Autocomplete
                options={raflar}
                getOptionLabel={(option) => {
                  const kat = kategoriler.find(
                    (k) => k.id === option.kategori_id
                  );
                  return `[${kat?.ad || "Bilinmeyen"}] ${option.raf_no}`;
                }}
                filterSelectedOptions
                value={raflar.find((r) => r.id === selectedId) || null}
                onChange={(_, newValue) => {
                  if (newValue) {
                    handleRafChange(newValue.id);
                  } else {
                    setSelectedId("");
                    setForm({ kategori_id: "", raf_no: "" });
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Raf Seç / Ara" />
                )}
                disabled={loading}
              />
            )}

            {(mode === "create" || mode === "update") && (
              <>
                <FormControl fullWidth>
                  <InputLabel>Kategori Seç</InputLabel>
                  <Select
                    value={form.kategori_id}
                    label="Kategori Seç"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, kategori_id: e.target.value }))
                    }
                    disabled={loading}
                  >
                    {kategoriler.map((k) => (
                      <MenuItem key={k.id} value={k.id}>
                        {k.ad}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Raf Adı"
                  value={form.raf_no}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, raf_no: e.target.value }))
                  }
                  disabled={loading}
                  fullWidth
                />
              </>
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
          {mode === "update" && selectedId && (
            <Button
              onClick={handleUpdate}
              variant="contained"
              disabled={loading}
            >
              Güncelle
            </Button>
          )}
          {mode === "delete" && selectedId && (
            <Button
              onClick={handleDelete}
              variant="outlined"
              color="error"
              disabled={loading}
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

export default ShelfManagerDialog;
