import {
  Box,
  Card,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Modal,
  TextField,
  IconButton,
  Tooltip,
  InputAdornment,
  Divider,
  Collapse,
} from "@mui/material";
import { Edit, Delete, History, Add, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import StudentCreateModal from "./StudentCreateModal";
import ConfirmDialog from "./ConfirmDialog";
import { toast } from "react-toastify";

interface Student {
  id: string;
  ad_soyad: string;
  eposta: string;
  olusturulma_tarihi: string;
}

const SUPABASE_BASE_URL = import.meta.env.VITE_SUPABASE_URL;

const StudentListPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [studentIdToDelete, setStudentIdToDelete] = useState<string | null>(
    null
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("kullanicilar").select("*");
    if (error) {
      toast.error("Öğrenciler yüklenirken hata oluştu.");
      setStudents([]);
    } else if (data) {
      setStudents(data);
    }
    setLoading(false);
  };

  const handleDeleteClick = (id: string) => {
    setStudentIdToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentIdToDelete) return;

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch(
        `${SUPABASE_BASE_URL}/functions/v1/smooth-action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ user_id: studentIdToDelete }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        toast.error("Kullanıcı silinemedi: " + errorText);
      } else {
        toast.success("Kullanıcı başarıyla silindi.");
        setStudents((prev) => prev.filter((s) => s.id !== studentIdToDelete));
      }
    } catch (error) {
      toast.error("Silme sırasında hata oluştu.");
    }

    setIsConfirmOpen(false);
    setStudentIdToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setStudentIdToDelete(null);
  };

  const handleEditSave = async () => {
    if (!selectedStudent) return;

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        toast.error("Kullanıcı oturumu bulunamadı.");
        return;
      }

      const res = await fetch(
        `${SUPABASE_BASE_URL}/functions/v1/bright-processor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: selectedStudent.id,
            ad_soyad: selectedStudent.ad_soyad,
            eposta: selectedStudent.eposta,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        toast.error("Güncelleme başarısız: " + errorText);
        return;
      }

      toast.success("Kullanıcı başarıyla güncellendi.");
      await fetchStudents();
      setIsEditModalOpen(false);
      setSelectedStudent(null);
    } catch {
      toast.error("Güncelleme sırasında hata oluştu.");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.ad_soyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.eposta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedStudents = filteredStudents.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" p={4}>
      <Box
        sx={{
          width: "90%",
          // maxWidth: 1200,
          p: 3,
          borderRadius: 4,
          bgcolor: "#f9f9f9",
          boxShadow: 3,
          overflowY: "auto",
          maxHeight: "80vh",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          gap={2}
          mb={4}
        >
          <Typography variant="h5">🎓 Öğrenci Listesi</Typography>

          <TextField
            placeholder="Öğrenci ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ maxWidth: 300, width: "100%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsCreateModalOpen(true)}
            fullWidth={true} // küçük ekranlarda buton genişlesin
            sx={{
              maxWidth: 200,
              alignSelf: { xs: "stretch", sm: "auto" },
            }}
          >
            Ekle
          </Button>
        </Stack>

        <Stack spacing={2}>
          {paginatedStudents.map((student) => (
            <Card
              key={student.id}
              sx={{ px: 2, py: 1, bgcolor: "#fff", boxShadow: 1 }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
              >
                <Box>
                  <Typography fontWeight="bold">{student.ad_soyad}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {student.eposta}
                  </Typography>
                </Box>
                <Typography color="text.secondary" variant="body2">
                  Oluşturulma:{" "}
                  {new Date(student.olusturulma_tarihi).toLocaleString()}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Kiralama Geçmişi">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(
                          `/officerDashboard/student-rental-history/${student.id}`
                        )
                      }
                      size="small"
                    >
                      <History />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Düzenle">
                    <IconButton
                      color="info"
                      onClick={() => {
                        setSelectedStudent({ ...student });
                        setIsEditModalOpen(true);
                      }}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(student.id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  <Button
                    size="small"
                    onClick={() =>
                      setExpandedId(
                        expandedId === student.id ? null : student.id
                      )
                    }
                  >
                    Detay
                  </Button>
                </Stack>
              </Stack>
              <Collapse
                in={expandedId === student.id}
                timeout="auto"
                unmountOnExit
              >
                <Divider sx={{ my: 1 }} />
                <Box px={2}>
                  <Typography variant="body2">
                    E-Posta: {student.eposta}
                  </Typography>
                  <Typography variant="body2">
                    Oluşturulma Tarihi:{" "}
                    {new Date(student.olusturulma_tarihi).toLocaleString()}
                  </Typography>
                </Box>
              </Collapse>
            </Card>
          ))}
        </Stack>

        <Stack direction="row" justifyContent="center" spacing={2} mt={4}>
          <Button
            variant="outlined"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
          >
            ◀ Geri
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              setPage((prev) =>
                (prev + 1) * itemsPerPage < filteredStudents.length
                  ? prev + 1
                  : prev
              )
            }
            disabled={(page + 1) * itemsPerPage >= filteredStudents.length}
          >
            İleri ▶
          </Button>
        </Stack>

        <StudentCreateModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onStudentAdded={fetchStudents}
        />

        <ConfirmDialog
          open={isConfirmOpen}
          title="Öğrenci Silme Onayı"
          message="Bu öğrenciyi silmek istediğinize emin misiniz?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

        <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" mb={2}>
              Öğrenci Güncelle
            </Typography>
            <TextField
              fullWidth
              label="Ad Soyad"
              value={selectedStudent?.ad_soyad || ""}
              onChange={(e) =>
                setSelectedStudent((prev) =>
                  prev ? { ...prev, ad_soyad: e.target.value } : null
                )
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="E-Posta"
              value={selectedStudent?.eposta || ""}
              onChange={(e) =>
                setSelectedStudent((prev) =>
                  prev ? { ...prev, eposta: e.target.value } : null
                )
              }
              sx={{ mb: 2 }}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="contained" onClick={handleEditSave}>
                Kaydet
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsEditModalOpen(false)}
              >
                İptal
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default StudentListPage;
