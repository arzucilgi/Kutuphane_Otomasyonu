import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Autocomplete,
  Alert,
  Typography,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { supabase } from "../../../lib/supabaseClient";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Kategori {
  id: string;
  ad: string;
}

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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmCallback, setConfirmCallback] = useState<() => void>(() => {});

  const clearForm = () => {
    setKategoriAdi("");
    setEditValue("");
    setSelectedId(null);
    setMode("none");
  };

  const fetchKategoriler = async () => {
    const { data, error } = await supabase
      .from("kategoriler")
      .select("*")
      .order("ad");
    if (!error && data) setKategoriler(data);
    else if (error) setFeedback({ type: "error", msg: error.message });
  };

  useEffect(() => {
    if (open) {
      clearForm();
      fetchKategoriler();
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
    const { data: kitaplar } = await supabase
      .from("kitaplar")
      .select("id")
      .eq("kategori_id", selectedId);

    if (kitaplar && kitaplar.length > 0) {
      setLoading(false);
      setFeedback({
        type: "error",
        msg: "Bu kategoriye ait kitaplar var. Önce o kitapları silin veya taşıyın.",
      });
      return;
    }

    const { data: raflar } = await supabase
      .from("raflar")
      .select("id")
      .eq("kategori_id", selectedId);

    if (raflar && raflar.length > 0) {
      setLoading(false);
      setFeedback({
        type: "error",
        msg: "Bu kategoriye bağlı raflar var. Önce rafları silin.",
      });
      return;
    }

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
        <DialogTitle>Kategori İşlemleri</DialogTitle>
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
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Onay</DialogTitle>
        <DialogContent>
          <Typography>{confirmMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Hayır</Button>
          <Button onClick={confirmCallback} variant="contained">
            Evet
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateCategoryDialog;
