import { NavLink } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import QuoteRotator from './QuoteRotator'
import LogoutButton from './LogoutButton'
import useAuth from '../hooks/useAuth'

const Navbar = () => {
  const { auth } = useAuth(); 
  
  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-green-700 text-white hover:bg-green-800 hover:text-white rounded-md px-4 py-2 font-semibold'
      : 'bg-green-50 text-green-700 hover:bg-green-700 hover:text-white rounded-md px-4 py-2 transition-colors duration-200'

  return (
    <>
      <nav className="bg-green-50 border-b shadow-md" style={{ borderColor: '#2F855A' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
          <NavLink
        to="/"
        className="flex items-center space-x-3"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-white font-bold text-lg">
          <img src="/images/logo_no_name.png" alt="Logo" />
        </div>
        <span>
          <QuoteRotator/>
          </span>

      </NavLink>

            <div className="hidden md:flex space-x-4">
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/jobs" className={linkClass}>
                Past Predictions
              </NavLink>
              <NavLink to="/add-job" className={linkClass}>
                My Account
              </NavLink>
              {auth?.accessToken && (
                <LogoutButton />
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
