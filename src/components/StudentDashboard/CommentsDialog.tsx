import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Comment {
  id: string;
  user_name: string;
  comment: string;
  rating: number;
  created_at: string;
}

interface CommentsDialogProps {
  open: boolean;
  onClose: () => void;
  comments: Comment[];
}

const CommentsDialog: React.FC<CommentsDialogProps> = ({
  open,
  onClose,
  comments,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Kitap Yorumları
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {comments.length === 0 ? (
          <Typography variant="body2" align="center">
            Henüz yorum yapılmamış.
          </Typography>
        ) : (
          <List>
            {comments.map(({ id, user_name, comment, rating, created_at }) => (
              <Box key={id} mb={2}>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {user_name}
                        </Typography>
                        <Rating value={rating} readOnly size="small" />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ whiteSpace: "pre-line" }}
                        >
                          {comment}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          mt={0.5}
                        >
                          {new Date(created_at).toLocaleDateString()}
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
  );
};

export default CommentsDialog;
