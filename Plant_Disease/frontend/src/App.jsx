import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import RequireAuth from './components/RequireAuth';
import HomePageFarmer from './pages/HomePageFarmer';
import HomePageUser from './pages/HomePageUser';
import HomePage from './pages/HomePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import RedirectIfLoggedIn from './components/RedirectIfLoggedIn';
import FarmerLayout from './layouts/FarmerLayout';
import FarmerPredictionPage from './pages/FarmerPredictionPage';
import { Reports } from './pages/ReportsPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* public routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route 
          path="/login" element={<LoginPage/>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/" element={<HomePage/>}/>

        {/* protected routes */}
          {/* User  */}
        <Route element = {<MainLayout/>}>
          <Route element={<RequireAuth allowedRoles={['user']}/>}>
          <Route path='user/home' element={<HomePageUser />} />
          </Route>
        </Route>
          {/* Farmer */}
        <Route element = {<FarmerLayout/>}>
          <Route element={<RequireAuth allowedRoles={['farmer']}/>}>
            <Route path='farmer/home' element={<HomePageFarmer />} />
            <Route path='farmer/predictions' element={<FarmerPredictionPage/>}/>
            <Route path='farmer/reports' element={<Reports/>}/>
          </Route>
        </Route>


        {/* catch all */}
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
