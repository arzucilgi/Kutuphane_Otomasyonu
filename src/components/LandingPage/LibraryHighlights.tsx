import React from "react";
import { Box, Typography, Card, Stack, Link } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { motion, type Variants } from "framer-motion";

const events = [
  {
    title: "Bilim ve Teknoloji Söyleşisi",
    date: "25 Temmuz 2025, 14:00",
    description:
      "Alanında uzman konuşmacılarla bilim ve teknoloji üzerine interaktif söyleşi.",
  },
  {
    title: "Edebiyat Kulübü Buluşması",
    date: "30 Temmuz 2025, 17:00",
    description: "Ayın kitabı üzerine keyifli tartışmalar ve okuma önerileri.",
  },
  {
    title: "Dijital Arşiv Atölyesi",
    date: "5 Ağustos 2025, 11:00",
    description:
      "Kütüphanemizin dijital kaynaklarına nasıl erişilir, arşiv kullanımı eğitimi.",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.18,
      type: "spring",
      stiffness: 60,
      damping: 15,
    },
  }),
};

const UpcomingEvents: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3, m: 0 }}>
      <Typography
        variant="h6"
        fontWeight="700"
        textAlign="end"
        gutterBottom
        sx={{
          background: "linear-gradient(90deg, #1976d2, #512da8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "0.1em",
        }}
      >
        Yaklaşan Etkinlikler
      </Typography>

      <Stack spacing={3}>
        {events.map((event, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
          >
            <Card
              elevation={0}
              sx={{
                backdropFilter: "blur(8px)",
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                borderRadius: 4,
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                cursor: "pointer",
                px: 3,
                py: 2,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: "0 14px 36px rgba(25, 118, 210, 0.25)",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EventIcon sx={{ color: "#1976d2", mr: 1.5, fontSize: 28 }} />
                <Typography variant="h6" fontWeight="700" sx={{ flexGrow: 1 }}>
                  {event.title}
                </Typography>
              </Box>

              <Typography
                variant="subtitle2"
                color="primary"
                sx={{ mb: 1, fontWeight: 600, letterSpacing: "0.03em" }}
              >
                {event.date}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, lineHeight: 1.5 }}
              >
                {event.description}
              </Typography>

              <Link
                href="#"
                underline="hover"
                color="primary"
                sx={{
                  fontWeight: "700",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
                onClick={() =>
                  alert(`Etkinlik detaylarına gidiliyor: ${event.title}`)
                }
              >
                Detaylar &rarr;
              </Link>
            </Card>
          </motion.div>
        ))}
      </Stack>
    </Box>
  );
};

export default UpcomingEvents;
