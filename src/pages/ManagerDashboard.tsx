import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import ManagerNavbar from "../components/ManagerDashboard/ManagerNavbar";

const ManagerDashboard = () => {
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
      <ManagerNavbar />
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

export default ManagerDashboard;
