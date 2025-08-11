import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { registerUser } from "../../../services/authService";
import ConfirmDialog from "./ConfirmDialog";
import { supabase } from "../../../lib/supabaseClient";

interface Props {
  open: boolean;
  onClose: () => void;
  onStudentAdded: () => void;
}

const StudentCreateModal = ({ open, onClose, onStudentAdded }: Props) => {
  const [adSoyad, setAdSoyad] = useState("");
  const [eposta, setEposta] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCreate = () => {
    setErrorMsg("");
    if (!adSoyad || !eposta || !password) {
      setErrorMsg("Tüm alanları doldurmalısınız.");
      return;
    }

    setConfirmOpen(true); // Onayı aç
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    // Giriş yapan kullanıcıyı al
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMsg("Giriş yapan kullanıcı bilgisi alınamadı.");
      toast.error("Giriş yapan kullanıcı bilgisi alınamadı.");
      return;
    }
    const result = await registerUser(adSoyad, eposta, password, user.id);

    if (!result.success) {
      setErrorMsg(result.message || "Kayıt işlemi başarısız.");
      toast.error("Öğrenci eklenemedi.");
    } else {
      toast.success("Öğrenci başarıyla eklendi.");
      onStudentAdded();
      onClose();
      setAdSoyad("");
      setEposta("");
      setPassword("");
      setErrorMsg("");
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>
            Yeni Öğrenci Ekle
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Ad Soyad"
            value={adSoyad}
            onChange={(e) => setAdSoyad(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="E-Posta"
            value={eposta}
            onChange={(e) => setEposta(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleCreate}>
              Kaydet
            </Button>
            <Button variant="outlined" onClick={onClose}>
              İptal
            </Button>
          </Stack>
        </Box>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Onayla"
        message="Bu öğrenciyi oluşturmak istediğinize emin misiniz?"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default StudentCreateModal;
