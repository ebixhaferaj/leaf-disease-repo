import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import RequireAuth from './components/RequireAuth'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/" element = {<MainLayout/>}>
          <Route index element={<HomePage />} />
          <Route path="/account" element={
            <RequireAuth>

            </RequireAuth>}
            />
        </Route>
        {/* other routes */}
      </Routes>
    </Router>
  )
}

export default App
