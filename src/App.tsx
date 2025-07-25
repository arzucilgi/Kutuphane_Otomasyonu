import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingLayout from "./components/LandingPage/LandingLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./components/StudentDashboard/StudentProfile/StudentProfile";
import { Book } from "@mui/icons-material";
import Books from "./components/StudentDashboard/Books";
import BooksStudentReads from "./components/StudentDashboard/BooksStudentReads";
import RecommendedBooks from "./components/StudentDashboard/RecommendedBooks";
import ProtectedRoute from "./components/StudentDashboard/ProtectedRoute";
import RentBook from "./components/StudentDashboard/RentBook";
import { ToastContainer } from "react-toastify";
import { div } from "framer-motion/client";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<LandingPage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route
          path="/studentDashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentProfile />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="books" element={<Books />} />
          <Route path="readBooks" element={<BooksStudentReads />} />
          <Route path="recommendations" element={<RecommendedBooks />} />
          <Route path="rentBook" element={<RentBook />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
