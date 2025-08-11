import { Routes, Route } from "react-router-dom";
import LandingLayout from "./components/LandingPage/LandingLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./components/StudentDashboard/StudentProfile/StudentProfile";
import Books from "./components/StudentDashboard/Books";
import UserRentHistoryTable from "./components/StudentDashboard/UserRentHistoryTable";
import FavoriteBooksTable from "./components/StudentDashboard/FavoriteBooksTable";
import ProtectedRoute from "./components/StudentDashboard/ProtectedRoute";
import RentBook from "./components/StudentDashboard/RentBook";
import { ToastContainer } from "react-toastify";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerProfile from "./components/ManagerDashboard/ManagerProfile";
import AddEmployee from "./components/ManagerDashboard/AddEmployee";
import OfficerDashboard from "./pages/OfficerDashboard";
import BookManagement from "./components/OfficerDashboard/BookManagement/BookManagement";
import BookList from "./components/OfficerDashboard/BookManagement/BookList";
import StudentListPage from "./components/OfficerDashboard/StudentManagement/StudentListPage";
import SingleBookHistoryPage from "./components/OfficerDashboard/RentalHistoryManagement/SingleBookHistoryPage";
import BookHistoryPage from "./components/OfficerDashboard/RentalHistoryManagement/BookHistoryPage";
import StudentRentalHistoryPage from "./components/OfficerDashboard/RentalHistoryManagement/StudentRentalHistoryPage";
import OfficerProfile from "./components/OfficerDashboard/ProfileManagement/OfficerProfile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<LandingPage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/* <Route path="/managerDashboard" element={<ManagerDashboard />} />
        <Route path="/officerDashboard" element={<OfficerDashboard />} /> */}

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
          <Route path="readBooks" element={<UserRentHistoryTable />} />
          <Route path="recommendations" element={<FavoriteBooksTable />} />
          <Route path="rentBook" element={<RentBook />} />
        </Route>
        <Route
          path="/managerDashboard"
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManagerProfile />} />
          <Route path="profile" element={<ManagerProfile />} />
          <Route path="add-employee" element={<AddEmployee />} />
        </Route>
        <Route
          path="/officerDashboard"
          element={
            <ProtectedRoute>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<OfficerProfile />} />
          <Route path="book-management" element={<BookManagement />}>
            <Route index element={<BookList />} />
          </Route>
          <Route path="rental-history" element={<BookHistoryPage />} />
          <Route
            path="rental-history/:bookId"
            element={<SingleBookHistoryPage />}
          />
          <Route
            path="student-rental-history/:studentId"
            element={<StudentRentalHistoryPage />}
          />
          <Route path="students" element={<StudentListPage />} />
          <Route path="profile" element={<OfficerProfile />} />
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
