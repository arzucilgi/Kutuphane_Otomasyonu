import React, { useEffect, useState } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { trTR } from "@mui/x-data-grid/locales";

import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import {
  fetchKitaplar,
  fetchYazarlar,
} from "../../../services/StudentServices/bookService";
import type {
  Kitap,
  Yazar,
} from "../../../services/StudentServices/bookTypeService";

const BookList = () => {
  const [kitaplar, setKitaplar] = useState<Kitap[]>([]);
  const [yazarlar, setYazarlar] = useState<Yazar[]>([]);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const [editOpen, setEditOpen] = useState(false);
  const [selectedKitap, setSelectedKitap] = useState<Kitap | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const [kitapData, yazarData] = await Promise.all([
          fetchKitaplar(),
          fetchYazarlar(),
        ]);

        setYazarlar(yazarData);

        const kitapWithRelations = kitapData.map((k) => ({
          ...k,
          yazar: yazarData.find((y) => y.id === k.yazar_id),
        }));

        setKitaplar(kitapWithRelations);
      } catch (error) {
        console.error(error);
        setHata("Veriler alınırken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleEditClick = (kitap: Kitap) => {
    setSelectedKitap(kitap);
    setEditOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedKitap) return;
    setSelectedKitap({ ...selectedKitap, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Güncellenecek kitap:", selectedKitap);
    setEditOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "kitap_adi", headerName: "Kitap Adı", width: 300 },
    {
      field: "yazar",
      headerName: "Yazar",
      width: 300,
      renderCell: (params: GridRenderCellParams) =>
        params.row.yazar?.isim || "—",
    },
    { field: "sayfa_sayisi", headerName: "Sayfa Sayısı", width: 200 },
    { field: "stok_adedi", headerName: "Stok Adedi", width: 200 },
    {
      field: "actions",
      headerName: "İşlemler",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleEditClick(params.row)}
        >
          Düzenle
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (hata) {
    return (
      <Typography color="error" textAlign="center" mt={4}>
        {hata}
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Kitap Listesi
      </Typography>
      <DataGrid
        rows={kitaplar}
        columns={columns}
        getRowId={(row) => row.id}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
        columnVisibilityModel={
          {
            // tüm sütunlar görünür
          }
        }
        disableColumnResize
        sx={{
          width: "75%",
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 3,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-cell": {
            fontSize: "0.95rem",
          },
          "& .MuiDataGrid-columnHeader": {
            maxWidth: "100%",
            overflow: "hidden",
          },
        }}
      />

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Kitap Düzenle</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Kitap Adı"
            name="kitap_adi"
            value={selectedKitap?.kitap_adi || ""}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Sayfa Sayısı"
            name="sayfa_sayisi"
            type="number"
            value={selectedKitap?.sayfa_sayisi || ""}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Stok Adedi"
            name="stok_adedi"
            type="number"
            value={selectedKitap?.stok_adedi || ""}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Özet"
            name="ozet"
            multiline
            rows={4}
            value={selectedKitap?.ozet || ""}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>İptal</Button>
          <Button onClick={handleSave} variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookList;
