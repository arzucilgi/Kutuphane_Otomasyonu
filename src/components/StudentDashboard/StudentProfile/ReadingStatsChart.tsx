import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  fetchUserReadStats,
  fetchCategories,
} from "../../../services/categoryService";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Stat {
  kategori_adi: string;
  kitap_sayisi: number;
}

interface Props {
  userId: string;
}

const ReadingStatsChart: React.FC<Props> = ({ userId }) => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const readBooks = await fetchUserReadStats(userId);
      const categories = await fetchCategories();
      const preparedStats = prepareStats(readBooks, categories);
      setStats(preparedStats);
      setLoading(false);
    };

    loadStats();
  }, [userId]);

  if (loading)
    return (
      <Box mt={6} textAlign="center">
        <CircularProgress />
        <Typography mt={2} color="text.secondary">
          📊 Yükleniyor, lütfen bekleyin...
        </Typography>
      </Box>
    );

  if (stats.length === 0)
    return (
      <Box mt={6} textAlign="center">
        <Typography variant="h6" color="text.secondary" fontStyle="italic">
          📚 Okuma verisi bulunamadı.
        </Typography>
      </Box>
    );

  const data = {
    labels: stats.map((s) => s.kategori_adi),
    datasets: [
      {
        label: "Okunan Kitap Sayısı",
        data: stats.map((s) => s.kitap_sayisi),
        backgroundColor: [
          "#ff9ca3", // pastel kırmızı-pembe (#FF6384)
          "#8fc8ff", // pastel açık mavi (#36A2EB)
          "#ffdb8c", // pastel sarı (#FFCE56)
          "#8fe3df", // pastel turkuaz (#4BC0C0)
          "#b7a4ff", // pastel mor (#9966FF)
          "#ffbb8a", // pastel turuncu (#FF9F40)
          "#b7d86a", // pastel açık yeşil (#8BC34A)
          "#f58ab3", // pastel pembe (#E91E63)
        ],
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 20,
      },
    ],
  };

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: "80%",
        mx: "auto",
        my: 5,
        p: 4,
        borderRadius: 4,
        background: "linear-gradient(to bottom right, #f0f4ff, #ffffff)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        textAlign: "center",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
          backgroundColor: "#f9f9ff",
        },
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        color="primary"
        mb={3}
        fontFamily="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      >
        📊 Okunan Kitapların Kategori Dağılımı
      </Typography>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: isMobile ? 300 : 400,
          maxWidth: 500,
          mx: "auto",
        }}
      >
        <Pie data={data} />
      </Box>
    </Paper>
  );
};

// Kategori bazında kitap sayısını hesapla
const prepareStats = (
  readBooks: any[],
  categories: { id: string; ad: string }[]
): Stat[] => {
  const counts: Record<string, number> = {};

  readBooks.forEach((rental) => {
    const kategoriId = rental.kitaplar?.kategori_id;
    if (!kategoriId) return;
    counts[kategoriId] = (counts[kategoriId] || 0) + 1;
  });

  return Object.entries(counts).map(([kategoriId, kitap_sayisi]) => {
    const kategori = categories.find((cat) => cat.id === kategoriId);
    return {
      kategori_adi: kategori?.ad || "Bilinmeyen",
      kitap_sayisi,
    };
  });
};

export default ReadingStatsChart;
