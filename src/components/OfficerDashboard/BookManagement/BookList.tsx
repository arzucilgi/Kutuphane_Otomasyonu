import React, { useEffect, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { GridRenderCellParams } from "@mui/x-data-grid";
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
  Autocomplete,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import DeleteIcon from "@mui/icons-material/Delete";
import { History } from "@mui/icons-material";

import {
  fetchKitaplar,
  fetchYazarlar,
  fetchKategoriler,
  fetchYayinevleri,
  fetchTurler,
  fetchRaflar,
  updateKitap,
  deleteKitap,
} from "../../../services/StudentServices/bookService";

import type {
  Kitap,
  Yazar,
  Kategori,
  Yayinevi,
  Tur,
  Raf,
} from "../../../services/StudentServices/bookTypeService";
import { useNavigate } from "react-router-dom";

const BookList = () => {
  const [kitaplar, setKitaplar] = useState<Kitap[]>([]);
  const [yazarlar, setYazarlar] = useState<Yazar[]>([]);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [yayinevleri, setYayinevleri] = useState<Yayinevi[]>([]);
  const [turler, setTurler] = useState<Tur[]>([]);
  const [raflar, setRaflar] = useState<Raf[]>([]);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const [editOpen, setEditOpen] = useState(false);
  const [selectedKitap, setSelectedKitap] = useState<Kitap | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [kitapToDelete, setKitapToDelete] = useState<Kitap | null>(null);

  // Filtreleri tutan state
  const [filters, setFilters] = useState<{
    yazarId: string | null;
    kategoriId: string | null;
    yayineviId: string | null;
    rafId: string | null;
  }>({
    yazarId: null,
    kategoriId: null,
    yayineviId: null,
    rafId: null,
  });

  // ** Yeni: Kategori seçimi için ayrı state **
  const [selectedKategoriId, setSelectedKategoriId] = useState<string | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const [
          kitapData,
          yazarData,
          kategoriData,
          yayineviData,
          turData,
          rafData,
        ] = await Promise.all([
          fetchKitaplar(),
          fetchYazarlar(),
          fetchKategoriler(),
          fetchYayinevleri(),
          fetchTurler(),
          fetchRaflar(),
        ]);

        setYazarlar(yazarData);
        setKategoriler(kategoriData);
        setYayinevleri(yayineviData);
        setTurler(turData);
        setRaflar(rafData);

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

  // Filtrelenmiş kitaplar
  const filteredKitaplar = kitaplar.filter((kitap) => {
    if (filters.yazarId && kitap.yazar_id !== filters.yazarId) return false;
    if (filters.kategoriId && kitap.kategori_id !== filters.kategoriId)
      return false;
    if (filters.yayineviId && kitap.yayinevi_id !== filters.yayineviId)
      return false;
    if (filters.rafId && kitap.raf_id !== filters.rafId) return false;
    return true;
  });

  const handleFilterChange = (
    filterName: keyof typeof filters,
    value: string | null
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Seçilen kitabın yüklenmesi veya değişmesi durumunda selectedKategoriId güncellenir
  useEffect(() => {
    setSelectedKategoriId(selectedKitap?.kategori_id || null);
  }, [selectedKitap]);

  // Kategori değiştiğinde hem selectedKategoriId hem de selectedKitap güncelleniyor, raf_id sıfırlanıyor
  const handleKategoriChange = (val: Kategori | null) => {
    const newKategoriId = val?.id || "";
    setSelectedKategoriId(newKategoriId);
    if (!selectedKitap) return;
    setSelectedKitap({
      ...selectedKitap,
      kategori_id: newKategoriId,
      raf_id: "", // Rafı temizle kategori değişince
    });
  };

  const handleEditClick = (kitap: Kitap) => {
    setSelectedKitap(kitap);
    setEditOpen(true);
  };

  const handleDeleteClick = (kitap: Kitap) => {
    setKitapToDelete(kitap);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!kitapToDelete) return;

    try {
      await deleteKitap(kitapToDelete.id);
      setKitaplar((prev) => prev.filter((k) => k.id !== kitapToDelete.id));
      setDeleteDialogOpen(false);
      setKitapToDelete(null);
    } catch (error) {
      console.error(error);
      alert("Silme sırasında bir hata oluştu.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!selectedKitap) return;
    setSelectedKitap({ ...selectedKitap, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: keyof Kitap, value: string) => {
    if (!selectedKitap) return;
    setSelectedKitap({ ...selectedKitap, [field]: value });
  };

  const handleSave = async () => {
    if (!selectedKitap) return;
    try {
      await updateKitap(selectedKitap);
      const updatedList = kitaplar.map((k) =>
        k.id === selectedKitap.id ? selectedKitap : k
      );
      setKitaplar(updatedList);
      setEditOpen(false);
    } catch (error) {
      console.error(error);
      alert("Güncelleme sırasında bir hata oluştu.");
    }
  };

  const columns: GridColDef[] = [
    { field: "kitap_adi", headerName: "Kitap Adı", flex: 1, minWidth: 180 },
    {
      field: "yazar",
      headerName: "Yazar",
      flex: 1,
      minWidth: 160,
      renderCell: (params: GridRenderCellParams) =>
        params.row.yazar?.isim || "—",
      sortable: false,
      filterable: false,
    },
    {
      field: "sayfa_sayisi",
      headerName: "Sayfa Sayısı",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "stok_adedi",
      headerName: "Stok Adedi",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "İşlemler",
      width: 190,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={3} m={1}>
          <Tooltip title="Kiralama Geçmişi">
            <IconButton
              color="primary"
              onClick={() =>
                navigate(`/officerDashboard/rental-history/${params.id}`)
              }
              size="small"
            >
              <History />
            </IconButton>
          </Tooltip>
          <Tooltip title="Düzenle">
            <IconButton
              size="small"
              onClick={() => handleEditClick(params.row)}
              sx={{
                color: "#1976d2",
                backgroundColor: "#e3f2fd",
                "&:hover": { backgroundColor: "#90caf9" },
                boxShadow: "0 0 5px rgba(25, 118, 210, 0.5)",
              }}
            >
              <EditDocumentIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sil">
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(params.row)}
              sx={{
                color: "#d32f2f",
                backgroundColor: "#ffebee",
                "&:hover": { backgroundColor: "#ffcdd2" },
                boxShadow: "0 0 5px rgba(211, 47, 47, 0.4)",
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
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
    <Box>
      {/* Filtre inputları */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={2}
        flexWrap="wrap"
      >
        <Autocomplete
          options={yazarlar}
          getOptionLabel={(option) => option.isim}
          value={yazarlar.find((y) => y.id === filters.yazarId) || null}
          onChange={(_, val) => handleFilterChange("yazarId", val?.id || null)}
          renderInput={(params) => <TextField {...params} label="Yazar" />}
          clearOnEscape
          isOptionEqualToValue={(option, value) => option.id === value.id}
          size="small"
          sx={{ minWidth: 250 }}
        />
        <Autocomplete
          options={kategoriler}
          getOptionLabel={(option) => option.ad}
          value={kategoriler.find((k) => k.id === filters.kategoriId) || null}
          onChange={(_, val) =>
            handleFilterChange("kategoriId", val?.id || null)
          }
          renderInput={(params) => <TextField {...params} label="Kategori" />}
          clearOnEscape
          isOptionEqualToValue={(option, value) => option.id === value.id}
          size="small"
          sx={{ minWidth: 250 }}
        />
        <Autocomplete
          options={yayinevleri}
          getOptionLabel={(option) => option.isim}
          value={yayinevleri.find((y) => y.id === filters.yayineviId) || null}
          onChange={(_, val) =>
            handleFilterChange("yayineviId", val?.id || null)
          }
          renderInput={(params) => <TextField {...params} label="Yayınevi" />}
          clearOnEscape
          isOptionEqualToValue={(option, value) => option.id === value.id}
          size="small"
          sx={{ minWidth: 250 }}
        />
        <Autocomplete
          options={raflar}
          getOptionLabel={(option) => option.raf_no}
          value={raflar.find((r) => r.id === filters.rafId) || null}
          onChange={(_, val) => handleFilterChange("rafId", val?.id || null)}
          renderInput={(params) => <TextField {...params} label="Raf" />}
          clearOnEscape
          isOptionEqualToValue={(option, value) => option.id === value.id}
          size="small"
          sx={{ minWidth: 250 }}
        />
      </Stack>

      <DataGrid
        rows={filteredKitaplar}
        columns={columns}
        getRowId={(row) => row.id}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
        autoHeight
        sx={{
          backgroundColor: "#fff",
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          fontSize: "0.95rem",
          "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader": {
            backgroundColor: "#1976d2",
            color: "#fff",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #eee",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#e3f2fd",
            cursor: "pointer",
          },
        }}
      />

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.4rem" }}>
          📘 Kitap Düzenle
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: "#f9f9f9", py: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Kitap Adı"
              name="kitap_adi"
              value={selectedKitap?.kitap_adi || ""}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <Box display="flex" gap={2}>
              <TextField
                label="Sayfa Sayısı"
                name="sayfa_sayisi"
                type="number"
                value={selectedKitap?.sayfa_sayisi || ""}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Stok Adedi"
                name="stok_adedi"
                type="number"
                value={selectedKitap?.stok_adedi || ""}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>
            <Stack spacing={2}>
              {/* Kategori autocomplete: ayrı state ile */}
              <Autocomplete
                options={kategoriler}
                getOptionLabel={(option) => option.ad}
                value={
                  kategoriler.find((k) => k.id === selectedKategoriId) || null
                }
                onChange={(_, val) => handleKategoriChange(val)}
                renderInput={(params) => (
                  <TextField {...params} label="Kategori" />
                )}
                fullWidth
              />
              <Autocomplete
                options={yayinevleri}
                getOptionLabel={(option) => option.isim}
                value={
                  yayinevleri.find(
                    (y) => y.id === selectedKitap?.yayinevi_id
                  ) || null
                }
                onChange={(_, val) =>
                  handleSelectChange("yayinevi_id", val?.id || "")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Yayınevi" />
                )}
                fullWidth
              />
              <Autocomplete
                options={yazarlar}
                getOptionLabel={(option) => option.isim}
                value={
                  yazarlar.find((y) => y.id === selectedKitap?.yazar_id) || null
                }
                onChange={(_, val) =>
                  handleSelectChange("yazar_id", val?.id || "")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Yazar" />
                )}
                fullWidth
              />
              <Autocomplete
                options={turler}
                getOptionLabel={(option) => option.ad}
                value={
                  turler.find((t) => t.id === selectedKitap?.tur_id) || null
                }
                onChange={(_, val) =>
                  handleSelectChange("tur_id", val?.id || "")
                }
                renderInput={(params) => <TextField {...params} label="Tür" />}
                fullWidth
              />
              {/* Raf autocomplete: sadece seçilen kategoriye ait raflar listelenir */}
              <Autocomplete
                options={
                  selectedKategoriId
                    ? raflar.filter((r) => r.kategori_id === selectedKategoriId)
                    : []
                }
                getOptionLabel={(option) => option.raf_no}
                value={
                  raflar.find((r) => r.id === selectedKitap?.raf_id) || null
                }
                onChange={(_, val) =>
                  handleSelectChange("raf_id", val?.id || "")
                }
                renderInput={(params) => <TextField {...params} label="Raf" />}
                fullWidth
                disabled={!selectedKategoriId}
                noOptionsText="Önce kategori seçin"
              />
            </Stack>
            <TextField
              label="Kapak URL"
              name="kapak_url"
              value={selectedKitap?.kapak_url || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Özet"
              name="ozet"
              value={selectedKitap?.ozet || ""}
              onChange={handleInputChange}
              multiline
              minRows={4}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditOpen(false)} variant="outlined">
            İptal
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: "#4caf50",
              color: "#fff",
              "&:hover": { backgroundColor: "#388e3c" },
            }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Kitabı Sil</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>{kitapToDelete?.kitap_adi}</strong> adlı kitabı silmek
            istediğinize emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookList;
