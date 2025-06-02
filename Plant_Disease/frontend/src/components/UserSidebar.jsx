import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Brain, 
  BookOpen, 
  User 
} from 'lucide-react';
import LogoutButton from './LogoutButton';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/user/home',
    icon: LayoutDashboard
  },
  {
    title: 'Predictions',
    href: '/user/predictions',
    icon: Brain
  },
  {
    title: 'Profile',
    href: '/user/profile',
    icon: User
  }
];

const UserSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img src="/images/logo_no_name.png" alt="Logo" className="w-15 h-10" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-leaf-800">HealthyGreens</h1>
          <p className="text-sm text-gray-500">User Dashboard</p>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-leaf-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </Link>
              </li>
            );
          })}
            <LogoutButton/>
        </ul>
      </nav>
    </div>
  );
};

export default UserSidebar;
