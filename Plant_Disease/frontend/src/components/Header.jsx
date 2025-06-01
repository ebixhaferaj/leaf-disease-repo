
import { Leaf } from 'lucide-react';
import { NavLink } from 'react-router-dom';


const Header = () => {
  return (
    <header className="py-4 px-6 bg-white/70 backdrop-blur-sm sticky top-0 z-10 border-b border-leaf-100">
      <div className="container max-w-6xl mx-auto flex justify-between items-center">
        <a href="/" className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-white font-bold text-sm">
          <img src="/images/logo_no_name.png" alt="Logo" />
        </div>
          <span className="font-medium text-xl">HealthyGreens</span>
        </a>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="plants-database" className="text-muted-foreground hover:text-foreground transition-colors">Plants Database</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
        </nav>
        <div className="flex items-center space-x-3">
          <NavLink to="/login" className="hidden md:inline-flex items-center px-4 py-2 border border-leaf-200 text-leaf-700 bg-white hover:bg-leaf-50 hover:text-leaf-700 rounded-md transition-colors">
            Sign In
          </NavLink>
          <NavLink to="register" className="inline-flex items-center px-4 py-2 bg-leaf-600 hover:bg-leaf-700 text-white rounded-md transition-colors">
            Create Account
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;