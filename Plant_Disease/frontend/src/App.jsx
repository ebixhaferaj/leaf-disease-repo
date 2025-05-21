import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'

import { Toaster } from 'react-hot-toast';

function App() {
  const [count, setCount] = useState(0)

  return (
    
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
       
        {/* other routes */}
      </Routes>
    </Router>
  )
}

export default App
