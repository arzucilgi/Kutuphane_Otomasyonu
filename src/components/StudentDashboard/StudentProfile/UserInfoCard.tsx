import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Divider,
  Chip,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { supabase } from "../../../lib/supabaseClient";
import { getActiveRentalCount } from "../../../services/StudentServices/RentCheckService";

interface Props {
  userData: any;
  onUpdate?: (updatedUser: any) => void;
}

const UserInfoCard: React.FC<Props> = ({ userData, onUpdate }) => {
  const [activeCount, setActiveCount] = useState<number | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData.ad_soyad || "");
  const [email, setEmail] = useState(userData.eposta || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveCount = async () => {
      const count = await getActiveRentalCount(userData.id);
      setActiveCount(count);
    };
    fetchActiveCount();
  }, [userData.id]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Mevcut oturumu al
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getUser();
      if (sessionError) throw sessionError;

      const currentUserId = sessionData?.user?.id;
      if (currentUserId !== userData.id) {
        throw new Error("Sadece kendi profilinizi güncelleyebilirsiniz.");
      }

      // 2. Supabase Auth'ta e-posta değişikliği isteği
      const { error: authError } = await supabase.auth.updateUser({
        email: email,
      });
      if (authError) throw authError;

      // 3. Supabase Auth kullanıcısını tekrar çek (güncellenmiş durumu almak için)
      const { data: updatedUserData, error: getUserError } =
        await supabase.auth.getUser();
      if (getUserError) throw getUserError;

      const isEmailConfirmed = updatedUserData?.user?.email === email;

      if (isEmailConfirmed) {
        // 5. Kullanıcılar tablosunu güncelle
        const { error: dbError } = await supabase
          .from("kullanicilar")
          .update({
            ad_soyad: name,
            eposta: email,
          })
          .eq("id", userData.id);

        if (dbError) throw dbError;
      } else {
        // E-posta onaylanmadı, sadece isim güncellenebilir istersen:
        const { error: dbError } = await supabase
          .from("kullanicilar")
          .update({
            ad_soyad: name,
          })
          .eq("id", userData.id);

        if (dbError) throw dbError;

        setSuccess(
          "E-posta değişikliği için onay maili gönderildi. E-postayı onayladıktan sonra güncelleme tamamlanacaktır."
        );
        setIsEditing(false);
        if (onUpdate) onUpdate({ ...userData, ad_soyad: name });
        setLoading(false);
        return; // Burada işlemi sonlandırıyoruz çünkü e-posta henüz onaylanmadı.
      }

      // 6. Güncelleme başarılı ise kullanıcıya bildir
      setSuccess("Bilgiler başarıyla güncellendi.");
      setIsEditing(false);
      if (onUpdate) onUpdate({ ...userData, ad_soyad: name, eposta: email });
    } catch (err: any) {
      setError(err.message || "Güncelleme sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(userData.ad_soyad || "");
    setEmail(userData.eposta || "");
    setError(null);
    setSuccess(null);
  };

  return (
    <Card
      sx={{
        position: "absolute",
        top: "20%",
        left: "30%",
        width: "25%",
        height: "45%",
        mx: "auto",
        p: 3,
        borderRadius: 5,
        boxShadow: 6,
        background: "linear-gradient(135deg, #ffffff, #f3f7fd)",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="flex-start" mb={2}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: 60,
              height: 60,
              boxShadow: 3,
            }}
          >
            <PersonIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            {isEditing ? (
              <>
                <TextField
                  label="İsim"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="E-posta"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="small"
                  type="email"
                />
              </>
            ) : (
              <>
                <Typography variant="h5" fontWeight={600} color="#333">
                  {userData.ad_soyad}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userData.eposta}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <CardContent sx={{ px: 0 }}>
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="body1" color="text.secondary">
            <strong>Rol:</strong>{" "}
            <Chip
              label={userData.rol.toUpperCase()}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Typography>

          <Typography variant="body1" color="text.secondary">
            <strong>Ceza Tarihi:</strong>{" "}
            {userData.ceza_tarihi ? (
              <span style={{ color: "#d32f2f", fontWeight: 500 }}>
                {new Date(userData.ceza_tarihi).toLocaleDateString()}
              </span>
            ) : (
              <span style={{ color: "#388e3c", fontWeight: 500 }}>Yok</span>
            )}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            <strong>Aktif Kiralık Kitap:</strong>{" "}
            {activeCount !== null ? activeCount : "Yükleniyor..."}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            <strong>Hesap Oluşturulma Tarihi: </strong>
            {new Date(userData.olusturulma_tarihi).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}

      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
        {isEditing ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
            >
              İptal
            </Button>
          </>
        ) : (
          <Button variant="outlined" onClick={() => setIsEditing(true)}>
            Düzenle
          </Button>
        )}
      </Stack>
    </Card>
  );
};

export default UserInfoCard;
