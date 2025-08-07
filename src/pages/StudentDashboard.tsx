import { Outlet } from "react-router-dom";
import StudentNavbar from "../components/StudentDashboard/StudentNavbar ";
import { Box } from "@mui/material";

const StudentDashboard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
        // height: "100vh", // Tüm ekran yüksekliği
        overflowY: "hidden",
      }}
    >
      <StudentNavbar />
      <Box
        sx={{
          flex: 1, // Navbar dışındaki alanı kapla
          overflowY: "auto", // Scroll burada olsun
          px: 2,
        }}
      >
        <Outlet /> {/* Burada Books render olacak */}
      </Box>
    </Box>
  );
};

export default StudentDashboard;
