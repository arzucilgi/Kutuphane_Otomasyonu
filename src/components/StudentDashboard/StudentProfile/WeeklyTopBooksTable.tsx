import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";
import { fetchMostReadBooksThisWeek } from "../../../services/StudentServices/MostReadBooksService";

const WeeklyTopBooksChart = () => {
  const [books, setBooks] = useState<any[]>([]);

  const colors = [
    "#90caf9", // pastel mavi
    "#81c784", // pastel yeşil
    "#ffb74d", // pastel turuncu
    "#e57373", // pastel kırmızı
    "#ba68c8", // pastel mor
  ];

  useEffect(() => {
    const getData = async () => {
      const result = await fetchMostReadBooksThisWeek();
      setBooks(result);
    };
    getData();
  }, []);

  return (
    <Paper
      elevation={4}
      sx={{
        width: 400,
        maxWidth: "100%",
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
        align="center"
        sx={{ mb: 2 }}
        color="#1976d2"
      >
        Haftalık En Çok Okunan 5 Kitap
      </Typography>
      <Box sx={{ width: "90%", minWidth: "90%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={books}
            margin={{ top: 10, right: 0, left: 0, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="6 6" />
            <XAxis
              dataKey="kitap_adi"
              interval={0}
              height={20}
              tick={({ x, y, payload }) => {
                const value = payload.value;
                const bookIndex = books.findIndex(
                  (book) => book.kitap_adi === value
                );
                const fillColor = colors[bookIndex % colors.length];
                const lines = value.split(" ");

                return (
                  <text
                    x={x}
                    y={y + 10}
                    textAnchor="middle"
                    fill={fillColor}
                    fontSize={12}
                  >
                    {lines.map((line: string, index: number) => (
                      <tspan x={x} dy={index === 0 ? 0 : 12} key={index}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                );
              }}
            />
            <YAxis />
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{
                position: "absolute",
                bottom: 0,
                left: 0,
                margin: 10,
                fontSize: "18px",
                color: "#1976d2",
              }}
            />
            <Bar dataKey="kira_sayisi" name="Okunma Sayısı">
              {books.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default WeeklyTopBooksChart;
