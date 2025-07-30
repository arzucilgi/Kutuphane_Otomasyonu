import { Box, Button, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import CreateBookDialog from "./CreateBookDialog";
import CreateAuthorDialog from "./CreateAuthorDialog";
import CreateCategoryDialog from "./CreateCategoryDialog";
import CreateShelfDialog from "./CreateShelfDialog";
import { Outlet } from "react-router-dom";
import CreatePublisherDialog from "./CreatePublisherDialog";

const BookManagement = () => {
  const [openBook, setOpenBook] = useState(false);
  const [openAuthor, setOpenAuthor] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openShelf, setOpenShelf] = useState(false);
  const [openPublisher, setOpenPublisher] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Box sx={{ p: 2, textAlign: "right" }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenBook(true)}
          >
            Kitap Ekle
          </Button>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setOpenAuthor(true)}
          >
            Yazar İşlemleri
          </Button>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setOpenCategory(true)}
          >
            Kategori İşlemleri
          </Button>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setOpenShelf(true)}
          >
            Raf İşlemleri
          </Button>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setOpenPublisher(true)}
          >
            Yayın Evi İşlemleri
          </Button>
        </Stack>
      </Box>

      <Box
        sx={
          {
            // width: "100%",
            // height: "100%",
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
          }
        }
      >
        <CreateBookDialog open={openBook} onClose={() => setOpenBook(false)} />
        <CreateAuthorDialog
          open={openAuthor}
          onClose={() => setOpenAuthor(false)}
        />
        <CreateCategoryDialog
          open={openCategory}
          onClose={() => setOpenCategory(false)}
        />
        <CreateShelfDialog
          open={openShelf}
          onClose={() => setOpenShelf(false)}
        />
        <CreatePublisherDialog
          open={openPublisher}
          onClose={() => setOpenPublisher(false)}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default BookManagement;
