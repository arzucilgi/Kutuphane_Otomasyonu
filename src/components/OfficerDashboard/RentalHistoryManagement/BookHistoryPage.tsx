// BookHistoryPage.tsx

import React from "react";
import { Grid, Paper, Box } from "@mui/material";
import UndeliveredBooks from "./UndeliveredBooks";
import PandingRentals from "./PendingRentals"; // Doğru dosya yoluna göre ayarla

const BookHistoryPage: React.FC = () => {
  return (
    <Box sx={{ mt: 5, mb: 5, width: "100%" }}>
      <Grid>
        <Paper elevation={3} sx={{ p: 3 }}>
          <PandingRentals />
        </Paper>
      </Grid>
      <Grid>
        <Paper elevation={3} sx={{ p: 3 }}>
          <UndeliveredBooks />
        </Paper>
      </Grid>
    </Box>
  );
};

export default BookHistoryPage;
