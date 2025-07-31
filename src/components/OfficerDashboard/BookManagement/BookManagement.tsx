import {
  Box,
  Button,
  Stack,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useState } from "react";
import CreateBookDialog from "./CreateBookDialog";
import CreateAuthorDialog from "./CreateAuthorDialog";
import CreateCategoryDialog from "./CreateCategoryDialog";
import CreateShelfDialog from "./CreateShelfDialog";
import CreatePublisherDialog from "./CreatePublisherDialog";
import { Outlet } from "react-router-dom";

const BookManagement = () => {
  const [openBook, setOpenBook] = useState(false);
  const [openAuthor, setOpenAuthor] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openShelf, setOpenShelf] = useState(false);
  const [openPublisher, setOpenPublisher] = useState(false);

  const commonButtonStyle = {
    minWidth: 160,
    fontWeight: 500,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: "15px",
    py: 1.5,
    px: 3,
    transition: "all 0.3s ease",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "#f4f6f8",
        width: "100%",
        height: "100%",
        minHeight: "100%",
        // p: 2,
      }}
    >
      <Card
        sx={{
          width: "70%",
          boxShadow: 3,
          borderRadius: 3,
          backgroundColor: "#fff",
          m: 3,
        }}
      >
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              📚 Kitap Yönetim Paneli
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Buradan kitap, yazar, kategori, yayınevi ve raf bilgilerini
              kolayca yönetebilirsiniz.
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button
              variant="contained"
              onClick={() => setOpenBook(true)}
              sx={{
                ...commonButtonStyle,
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#125ea2",
                },
                color: "#fff",
              }}
            >
              Kitap Ekle
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenAuthor(true)}
              sx={{
                ...commonButtonStyle,
                borderColor: "#888",
                color: "#333",
                backgroundColor: "#f9f9f9",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                  borderColor: "#666",
                },
              }}
            >
              Yazar İşlemleri
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenCategory(true)}
              sx={{
                ...commonButtonStyle,
                borderColor: "#888",
                color: "#333",
                backgroundColor: "#f9f9f9",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                  borderColor: "#666",
                },
              }}
            >
              Kategori İşlemleri
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenShelf(true)}
              sx={{
                ...commonButtonStyle,
                borderColor: "#888",
                color: "#333",
                backgroundColor: "#f9f9f9",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                  borderColor: "#666",
                },
              }}
            >
              Raf İşlemleri
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenPublisher(true)}
              sx={{
                ...commonButtonStyle,
                borderColor: "#888",
                color: "#333",
                backgroundColor: "#f9f9f9",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                  borderColor: "#666",
                },
              }}
            >
              Yayın Evi İşlemleri
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ mb: 5, width: "70%" }}>
        <Outlet />
      </Box>

      {/* Dialog Modalları */}
      <CreateBookDialog open={openBook} onClose={() => setOpenBook(false)} />
      <CreateAuthorDialog
        open={openAuthor}
        onClose={() => setOpenAuthor(false)}
      />
      <CreateCategoryDialog
        open={openCategory}
        onClose={() => setOpenCategory(false)}
      />
      <CreateShelfDialog open={openShelf} onClose={() => setOpenShelf(false)} />
      <CreatePublisherDialog
        open={openPublisher}
        onClose={() => setOpenPublisher(false)}
      />
    </Box>
  );
};

export default BookManagement;
