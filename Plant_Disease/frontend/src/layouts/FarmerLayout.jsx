import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return <>
    <div className="min-h-screen bg-gray-50 flex">
        <Sidebar/>
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <Outlet/>
        </main>
    </div>
  </>
}

export default MainLayout