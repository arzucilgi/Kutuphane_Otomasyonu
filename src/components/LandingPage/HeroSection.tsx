import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Box, IconButton } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

const images = [
  "/images/lib/lib1.jpg",
  "/images/lib/lib2.jpg",
  "/images/lib/lib3.jpg",
  "/images/lib/lib4.jpg",
  "/images/lib/lib5.jpg",
  "/images/lib/lib6.jpg",
];

const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  }),
};

const ImageSlider: React.FC = () => {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);

  // Otomatik geçiş
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(([prevIndex]) => [(prevIndex + 1) % images.length, 1]);
    }, 3000); // 5 saniyede bir geçiş yap

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setIndex(([prevIndex]) => [(prevIndex + 1) % images.length, 1]);
  };

  const handlePrev = () => {
    setIndex(([prevIndex]) => [
      (prevIndex - 1 + images.length) % images.length,
      -1,
    ]);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "800px",
        height: "500px",
        overflow: "hidden",
        margin: "0 auto",
        borderRadius: 2,
        boxShadow: 3,
        userSelect: "none",
      }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={index}
          src={images[index]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </AnimatePresence>

      <IconButton
        onClick={handlePrev}
        sx={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0,0,0,0.4)",
          color: "white",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
          zIndex: 10,
        }}
        aria-label="previous slide"
      >
        <ArrowBackIosNew />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0,0,0,0.4)",
          color: "white",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
          zIndex: 10,
        }}
        aria-label="next slide"
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
};

export default ImageSlider;
