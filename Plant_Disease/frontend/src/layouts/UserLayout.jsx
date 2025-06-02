import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';

const UserLayout = () => {
  return <>
      <div className="min-h-screen bg-gray-50 flex">    
        <UserSidebar/>
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <Outlet/>
        </main>
      </div>
  </>
}

export default UserLayout