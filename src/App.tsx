import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingLayout from './components/LandingPage/LandingLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/StudentDashboard';

function App() {
  return (
  
      <Routes>
         <Route path="/" element={<LandingLayout />}>
            <Route index element={<LandingPage />} /> 
        </Route>
        <Route path='login' element={<LoginPage/>}/>
        <Route path='register' element={<RegisterPage/>}/>
         <Route path='dashboard' element={<Dashboard/>}/>
      </Routes>
  );
}

export default App;
