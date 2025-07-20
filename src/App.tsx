import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingLayout from '../src/components/LandingPage/LandingLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
  
      <Routes>
         <Route path="/" element={<LandingLayout />}>
            <Route index element={<LandingPage />} /> 
        </Route>
        <Route path='login' element={<LoginPage/>}/>
      </Routes>
  );
}

export default App;
