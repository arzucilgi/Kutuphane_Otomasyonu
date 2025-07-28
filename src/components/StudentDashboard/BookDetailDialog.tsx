// components/BookDetailDialog.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  IconButton,
  Typography,
  Button,
  Rating,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import type { Kitap } from "../../services/bookTypeService";
import { supabase } from "../../lib/supabaseClient";

interface Comment {
  id: string;
  kullanici_id: string;
  kitap_id: string;
  yorum: string;
  puan: number;
  tarih: string;
  kullanicilar:
    | {
        id: string;
        ad_soyad: string;
      }[]
    | null;
  kullanici_adi?: string; // for joins
}

const BookDetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
}) => (
  <Box>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1">{value ?? "None"}</Typography>
  </Box>
);

interface BookDetailDialogProps {
  open: boolean;
  onClose: () => void;
  kitap: Kitap | null;
}

const BookDetailDialog: React.FC<BookDetailDialogProps> = ({
  open,
  onClose,
  kitap,
}) => {
  const navigate = useNavigate();

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async (kitapId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("yorumlar")
      .select(
        `id, kullanici_id, kitap_id, yorum, puan, tarih, kullanicilar: kullanicilar (id, ad_soyad)`
      )
      .eq("kitap_id", kitapId)
      .order("tarih", { ascending: false });

    if (!error && data) {
      const commentsWithUser = data.map((item) => ({
        ...item,
        kullanici_adi: item.kullanicilar?.ad_soyad ?? "Anonymous",
      }));
      setComments(commentsWithUser);
    } else {
      console.error("Failed to load comments", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (kitap && commentsOpen) {
      fetchComments(kitap.id);
    }
  }, [kitap, commentsOpen]);

  if (!kitap) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          sx={{
            bgcolor: "#fafafa",
            borderRadius: 2,
            overflow: "hidden",
            maxHeight: "90vh",
          }}
        >
          {/* Cover Image */}
          <Box
            sx={{
              width: { xs: "100%", md: "40%" },
              height: { xs: 300, md: "auto" },
              backgroundImage: `url(${
                kitap.kapak_url || "https://via.placeholder.com/300x400"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              flexShrink: 0,
            }}
          />

          {/* Book Details */}
          <Box
            flex={1}
            p={3}
            sx={{ overflowY: "auto", maxHeight: "90vh", position: "relative" }}
          >
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {kitap.kitap_adi}
            </Typography>

            <Box display="flex" flexDirection="column" gap={2} mt={4}>
              <BookDetailItem label="Yazar" value={kitap.yazar?.isim} />
              <BookDetailItem label="Yayınevi" value={kitap.yayinevi?.isim} />
              <BookDetailItem label="Kategori" value={kitap.kategori?.ad} />
              <BookDetailItem label="Sayfa Sayısı" value={kitap.sayfa_sayisi} />
              <BookDetailItem label="Stok Adedi" value={kitap.stok_adedi} />
              <BookDetailItem label="Raf Numarası" value={kitap.raf?.raf_no} />
              <BookDetailItem
                label="Added Date"
                value={kitap.eklenme_tarihi?.split("T")[0]}
              />

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Özet
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {kitap.ozet ?? "Summary not available."}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => setCommentsOpen(true)}
                disabled={loading}
              >
                Kitap Yorumları
              </Button>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() =>
                  navigate("/studentDashboard/rentBook", { state: { kitap } })
                }
              >
                Ödünç Al
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          maxHeight: 600,
          overflowY: "auto",
          mt: 10,
        }}
      >
        <DialogTitle>
          Kitap Yorumları
          <IconButton
            onClick={() => setCommentsOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {comments.length === 0 ? (
            <Typography variant="body2" align="center">
              Henüz Yorum YApılmadı!
            </Typography>
          ) : (
            <List>
              {comments.map((comment) => (
                <Box key={comment.id} mb={2}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {comment.kullanici_adi}
                          </Typography>
                          <Rating value={comment.puan} readOnly size="small" />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ whiteSpace: "pre-line" }}
                          >
                            {comment.yorum}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comment.tarih).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookDetailDialog;
