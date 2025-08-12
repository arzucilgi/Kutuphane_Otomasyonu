import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Grid,
} from "@mui/material";
import { supabase } from "../../../lib/supabaseClient";
import ConfirmDialog from "../../../components/OfficerDashboard/StudentManagement/ConfirmDialog";

interface Penalty {
  id: string;
  baslangic: string;
  bitis: string;
  aciklama: string;
  odeme_durumu: boolean;
  kullanici_id: string;
  kullanicilar?: {
    ad_soyad: string;
    eposta: string;
  };
}

const Penalties: React.FC = () => {
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState<Penalty | null>(null);

  // Sayfalama için state
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const fetchPenalties = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("cezalar")
      .select(
        `
        *,
        kullanicilar(ad_soyad, eposta)
      `
      )
      .eq("odeme_durumu", false)
      .order("baslangic", { ascending: false });

    if (error) {
      setError("Ceza bilgileri alınırken hata oluştu.");
      setPenalties([]);
    } else {
      setPenalties(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPenalties();
  }, []);

  const openConfirm = (penalty: Penalty) => {
    setSelectedPenalty(penalty);
    setConfirmOpen(true);
  };

  const handleConfirmPay = async () => {
    if (!selectedPenalty) return;
    setConfirmOpen(false);
    setPayingId(selectedPenalty.id);

    const { error } = await supabase
      .from("cezalar")
      .update({ odeme_durumu: true })
      .eq("id", selectedPenalty.id);

    if (error) {
      setError("Ödeme alınırken hata oluştu.");
    } else {
      await fetchPenalties();
      setError(null);
      // Sayfa sayısı değiştiyse ve son sayfa boş kaldıysa bir önceki sayfaya dön
      const newTotalPages = Math.ceil((penalties.length - 1) / itemsPerPage);
      if (page > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages);
      }
    }
    setPayingId(null);
    setSelectedPenalty(null);
  };

  // Toplam sayfa sayısı
  const totalPages = Math.ceil(penalties.length / itemsPerPage);

  // Gösterilecek kartların dilimi
  const paginatedPenalties = penalties.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box
      p={{ xs: 2, md: 4 }}
      sx={{ backgroundColor: "#f9fafc", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        mb={4}
        fontWeight="bold"
        sx={{
          textAlign: "center",
          color: "#2c3e50",
          letterSpacing: 1,
          fontSize: { xs: "1.6rem", md: "2rem" },
        }}
      >
        Ceza İşlemleri
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : error ? (
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      ) : penalties.length === 0 ? (
        <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
          Ödenmemiş ceza bulunmamaktadır.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3} justifyContent="center">
            {paginatedPenalties.map((penalty) => (
              <Grid key={penalty.id}>
                <Card
                  sx={{
                    boxShadow: 4,
                    borderRadius: 3,
                    width: "345px", // sabit genişlik
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        color: "#34495e",
                        fontSize: { xs: "1rem", md: "1.2rem" },
                      }}
                    >
                      Ceza Detayları
                    </Typography>

                    <Stack spacing={1} divider={<Divider />}>
                      <Typography>
                        <strong>Kullanıcı:</strong>{" "}
                        {penalty.kullanicilar?.ad_soyad || "Bilinmiyor"}
                      </Typography>
                      <Typography>
                        <strong>E-posta:</strong>{" "}
                        {penalty.kullanicilar?.eposta || "Bilinmiyor"}
                      </Typography>
                      <Typography>
                        <strong>Başlangıç:</strong>{" "}
                        {new Date(penalty.baslangic).toLocaleDateString()}
                      </Typography>
                      <Typography>
                        <strong>Bitiş:</strong>{" "}
                        {penalty.bitis
                          ? new Date(penalty.bitis).toLocaleDateString()
                          : "-"}
                      </Typography>
                      <Typography>
                        <strong>Durum:</strong>{" "}
                        {penalty.odeme_durumu ? "Ödendi" : "Bekliyor"}
                      </Typography>
                      <Typography>
                        <strong>Ceza:</strong>{" "}
                        {penalty.aciklama || "Belirtilmemiş"}
                      </Typography>
                    </Stack>

                    <Box mt={3} textAlign="right">
                      <Button
                        variant="contained"
                        onClick={() => openConfirm(penalty)}
                        disabled={payingId === penalty.id}
                        sx={{
                          borderRadius: "30px",
                          px: { xs: 2, md: 3 },
                          py: 1,
                          fontSize: { xs: "0.8rem", md: "1rem" },
                          background:
                            "linear-gradient(135deg, #3498db, #2980b9)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #2980b9, #1f618d)",
                          },
                        }}
                      >
                        {payingId === penalty.id
                          ? "Ödeme Alınıyor..."
                          : "Ödeme Al"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Sayfalama */}
          <Box
            mt={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <Button
              variant="outlined"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              ◀ Geri
            </Button>
            <Typography>
              Sayfa {page} / {totalPages}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              İleri ▶
            </Button>
          </Box>
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Ödeme Onayı"
        message={
          selectedPenalty
            ? `${selectedPenalty.kullanicilar?.ad_soyad || "Bu kullanıcı"} (${
                selectedPenalty.kullanicilar?.eposta || "E-posta yok"
              }) için "${
                selectedPenalty.aciklama || "Belirtilmemiş"
              }" cezasını ödemek istediğinize emin misiniz?`
            : ""
        }
        onConfirm={handleConfirmPay}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default Penalties;
