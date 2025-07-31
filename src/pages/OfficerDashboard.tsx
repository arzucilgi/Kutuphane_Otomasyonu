import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import ManagerNavbar from "../components/ManagerDashboard/ManagerNavbar";
import OfficerNavbar from "../components/OfficerDashboard/OfficerNavbar";

const OfficerDashboard = () => {
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
      <OfficerNavbar />
      <Box
        sx={{
          flex: 1, // Navbar dışındaki alanı kapla
          overflowY: "auto",
          backgroundColor: "blue",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default OfficerDashboard;
