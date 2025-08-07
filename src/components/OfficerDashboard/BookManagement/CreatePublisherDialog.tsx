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
} from "@mui/material";
import { supabase } from "../../../lib/supabaseClient";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Yayinevi {
  id: string;
  isim: string;
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

const CreatePublisherDialog: React.FC<Props> = ({ open, onClose }) => {
  const [mode, setMode] = useState<"none" | "create" | "update" | "delete">(
    "none"
  );

  const [yayinEviAdi, setYayinEviAdi] = useState("");
  const [yayinevleri, setYayinevleri] = useState<Yayinevi[]>([]);
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
    setYayinEviAdi("");
    setEditValue("");
    setSelectedId(null);
    setMode("none");
    // setFeedback(null);
  };

  const fetchYayinevleri = async () => {
    const { data, error } = await supabase
      .from("yayinevleri")
      .select("*")
      .order("isim");
    if (!error && data) {
      setYayinevleri(data);
    } else if (error) {
      setFeedback({ type: "error", msg: error.message });
    }
  };

  useEffect(() => {
    if (open) {
      clearForm();
      fetchYayinevleri();
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
    if (!yayinEviAdi.trim()) {
      setFeedback({ type: "error", msg: "Yayınevi adı boş olamaz." });
      return;
    }

    openConfirm(
      "Bu yayınevini eklemek istediğinize emin misiniz?",
      async () => {
        setLoading(true);

        const { error } = await supabase
          .from("yayinevleri")
          .insert({ isim: yayinEviAdi.trim() });

        setLoading(false);

        if (error) {
          setFeedback({ type: "error", msg: error.message });
        } else {
          setFeedback({ type: "success", msg: "Yayınevi başarıyla eklendi." });
          clearForm();
          fetchYayinevleri();
        }
      }
    );
  };

  const handleUpdate = () => {
    if (!selectedId || !editValue.trim()) {
      setFeedback({
        type: "error",
        msg: "Güncellemek için yayınevi seçmeli ve isim boş olmamalı.",
      });
      return;
    }

    openConfirm(
      "Bu yayınevini güncellemek istediğinize emin misiniz?",
      async () => {
        setLoading(true);

        const { error } = await supabase
          .from("yayinevleri")
          .update({ isim: editValue.trim() })
          .eq("id", selectedId);

        setLoading(false);

        if (error) {
          setFeedback({ type: "error", msg: error.message });
        } else {
          setFeedback({
            type: "success",
            msg: "Yayınevi başarıyla güncellendi.",
          });
          clearForm();
          fetchYayinevleri();
        }
      }
    );
  };

  const handleDelete = () => {
    if (!selectedId) {
      setFeedback({ type: "error", msg: "Silmek için yayınevi seçmelisiniz." });
      return;
    }

    openConfirm("Bu yayınevini silmek istediğinize emin misiniz?", async () => {
      setLoading(true);

      // 1️⃣ Önce bu yayınevine ait kitap var mı kontrol et
      const { data: kitaplar, error: kitapError } = await supabase
        .from("kitaplar")
        .select("id")
        .eq("yayinevi_id", selectedId);

      if (kitapError) {
        setLoading(false);
        setFeedback({ type: "error", msg: kitapError.message });
        return;
      }

      if (kitaplar && kitaplar.length > 0) {
        setLoading(false);
        setFeedback({
          type: "error",
          msg: "Bu yayınevine ait kitaplar bulunduğu için silinemez.",
        });
        return;
      }

      // 2️⃣ Yayın evini sil
      const { error } = await supabase
        .from("yayinevleri")
        .delete()
        .eq("id", selectedId);

      setLoading(false);

      if (error) {
        setFeedback({ type: "error", msg: error.message });
      } else {
        setFeedback({ type: "success", msg: "Yayınevi başarıyla silindi." });
        clearForm();
        fetchYayinevleri();
      }
    });
  };

  // Seçim değişimi
  const handleYayineviChange = (id: string | null) => {
    if (!id) {
      clearForm();
      return;
    }
    const yayınevi = yayinevleri.find((y) => y.id === id);
    if (yayınevi) {
      setSelectedId(yayınevi.id);
      setEditValue(yayınevi.isim);
    }
  };
  const actionButtons = [
    {
      key: "create",
      label: "Ekle",
      icon: <AddIcon />,
      bg: "#e3f2fd",
      hover: "#35a1f9ff",
      color: "#1976d2",
    },
    {
      key: "update",
      label: "Güncelle",
      icon: <EditIcon />,
      bg: "#fff3e0",
      hover: "#ffc743ff",
      color: "#ef6c00",
    },
    {
      key: "delete",
      label: "Sil",
      icon: <DeleteIcon />,
      bg: "#fdecea",
      hover: "#e3514eff",
      color: "#d32f2f",
    },
  ];

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Yayınevi İşlemleri</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {feedback && <Alert severity={feedback.type}>{feedback.msg}</Alert>}

            <Stack direction="row" spacing={1}>
              {actionButtons.map((action) => (
                <Button
                  key={action.key}
                  onClick={() => {
                    clearForm();
                    setMode(action.key as any);
                  }}
                  variant={mode === action.key ? "contained" : "outlined"}
                  startIcon={action.icon}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    minWidth: 130,
                    backgroundColor:
                      mode === action.key ? action.hover : action.bg,
                    color: mode === action.key ? "#fff" : action.color,
                    "&:hover": {
                      backgroundColor: action.hover,
                      color: "#fff",
                    },
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </Stack>

            {(mode === "update" || mode === "delete") && (
              <Autocomplete
                options={yayinevleri}
                getOptionLabel={(option) => option.isim}
                filterSelectedOptions
                value={yayinevleri.find((y) => y.id === selectedId) || null}
                onChange={(_, newValue) => {
                  if (newValue) handleYayineviChange(newValue.id);
                  else handleYayineviChange(null);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Yayınevi Seç / Ara" />
                )}
              />
            )}

            {(mode === "create" || mode === "update") && (
              <TextField
                label={mode === "create" ? "Yeni Yayınevi Adı" : "Yayınevi Adı"}
                value={mode === "create" ? yayinEviAdi : editValue}
                onChange={(e) =>
                  mode === "create"
                    ? setYayinEviAdi(e.target.value)
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
              color="primary"
            >
              Ekle
            </Button>
          )}
          {mode === "update" && (
            <Button
              onClick={handleUpdate}
              variant="contained"
              disabled={loading || !selectedId}
              color="warning"
            >
              Güncelle
            </Button>
          )}
          {mode === "delete" && (
            <Button
              onClick={handleDelete}
              variant="contained"
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

export default CreatePublisherDialog;
