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
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage' ;
import UpdateEmailPage from './pages/UpdateEmailPage';
import LearnPage from './pages/LearnPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ClassesDatabase from './components/ClassesDatabase';

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
        <Route path='confirm-email-update' element={<UpdateEmailPage />}/>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/how-it-works" element={<HowItWorksPage/>}/>
        <Route path="/plants-database" element={<ClassesDatabase/>}/>
        
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
            <Route path='farmer/reports' element={<ReportsPage/>}/>
            <Route path='farmer/profile' element={<ProfilePage/>}/>
            <Route path='farmer/learn' element={<LearnPage />}/>
          </Route>
        </Route>


        {/* catch all */}
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
