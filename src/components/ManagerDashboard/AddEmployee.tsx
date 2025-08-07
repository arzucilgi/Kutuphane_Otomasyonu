import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import { useSession } from "@supabase/auth-helpers-react";
import { addEmployeeService } from "../../services/ManagerServices/ManagerProfileServices/addEmployeeService";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    eposta: "",
    sifre: "",
    telefon: "",
    rol: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const session = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (!session?.user?.id) {
        throw new Error("Oturum bulunamadı.");
      }
      console.log(session.user.id);
      await addEmployeeService(formData, session.user.id);

      setSuccessMsg("Memur başarıyla eklendi.");
      setFormData({
        ad: "",
        soyad: "",
        eposta: "",
        sifre: "",
        telefon: "",
        rol: "",
      });
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Yeni Memur Ekle
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Ad"
            name="ad"
            value={formData.ad}
            onChange={handleChange}
            required
          />
          <TextField
            label="Soyad"
            name="soyad"
            value={formData.soyad}
            onChange={handleChange}
            required
          />
          <TextField
            label="E-posta"
            name="eposta"
            value={formData.eposta}
            onChange={handleChange}
            required
          />
          <TextField
            label="Şifre"
            name="sifre"
            type="password"
            value={formData.sifre}
            onChange={handleChange}
            required
          />
          <TextField
            label="Telefon"
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
          />
          <TextField
            label="Rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
          />

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Ekleniyor..." : "Memur Ekle"}
          </Button>

          {successMsg && <Alert severity="success">{successMsg}</Alert>}
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        </Stack>
      </form>
    </Box>
  );
};

export default AddEmployee;
