import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import {
  fetchUserReadStats,
  fetchCategories,
} from "../../../services/categoryService";

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

  if (loading) return <div>Yükleniyor...</div>;
  if (stats.length === 0) return <div>Okuma verisi bulunamadı.</div>;

  const data = {
    labels: stats.map((s) => s.kategori_adi),
    datasets: [
      {
        label: "Okunan Kitap Sayısı",
        data: stats.map((s) => s.kitap_sayisi),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 20,
      },
    ],
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h3>Okunan Kitapların Kategori Dağılımı</h3>
      <Pie data={data} />
    </div>
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
