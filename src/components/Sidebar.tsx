import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed top-0 left-0 w-full h-20 bg-nav-bg flex flex-row items-center justify-between z-50 lg:w-25.75 lg:h-full lg:flex-col lg:rounded-r-[20px]">
      <div className="flex items-center justify-between w-full h-full lg:flex-col">
        {/* Logo Section */}
        <Link 
          to="/" 
          className="relative flex items-center justify-center h-20 w-20 bg-primary rounded-r-[20px] lg:w-full lg:h-25.75"
          id="logo-link"
        >
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-primary-light rounded-tl-[20px] rounded-r-[20px]" />
          <svg width="28" height="26" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
            <path d="M20.505 14.823c0 3.21-1.892 5.337-4.593 5.337-2.831 0-4.81-2.103-4.81-5.337 0-3.351 2.004-5.337 4.81-5.337 2.701 0 4.593 1.986 4.593 5.337zm-4.593-3.645c-1.503 0-2.618.995-2.618 3.645 0 2.52 1.115 3.645 2.618 3.645 1.528 0 2.643-1.125 2.643-3.645 0-2.65-1.115-3.645-2.643-3.645zm-15.912-8.31V26h2.183v-8.736h6.702c4.137 0 6.671-2.483 6.671-5.836V11.23c0-3.414-2.534-5.897-6.671-5.897H0zm2.183 2.155h6.637c2.618 0 4.414 1.407 4.414 3.742v0c0 2.336-1.796 3.742-4.414 3.742H2.183V5.023z" fill="#FFF" fillRule="nonzero" />
          </svg>
        </Link>

        {/* Theme & Avatar Section */}
        <div className="flex items-center lg:flex-col lg:w-full">
          <button
            onClick={toggleTheme}
            className="p-6 transition-colors hover:text-white text-text-02 lg:p-8"
            id="theme-toggle"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} fill="currentColor" /> : <Sun size={20} fill="currentColor" />}
          </button>
          
          <div className="w-px h-20 bg-[#494E6E] lg:w-full lg:h-px" />
          
          <div className="p-6 lg:p-8">
            <div className="h-8 w-8 rounded-full bg-slate-400 overflow-hidden lg:h-10 lg:w-10">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
