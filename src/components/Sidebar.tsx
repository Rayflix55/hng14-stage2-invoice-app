import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { Link } from 'react-router-dom';
import avatar from '../assets/image-avatar.png';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed top-0 left-0 w-full h-20 bg-[#373B53] dark:bg-[#1E2139] flex flex-row items-center justify-between z-50 lg:w-25.75 lg:h-full lg:flex-col lg:rounded-r-[20px] overflow-hidden">
      <div className="flex items-center justify-between w-full h-full lg:flex-col">
        {/* Logo Section */}
        <Link 
          to="/" 
          className="relative flex items-center justify-center h-20 w-20 bg-primary rounded-r-[20px] lg:w-full lg:h-25.75 group overflow-hidden"
          id="logo-link"
        >
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-primary-light rounded-tl-[20px]" />
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 scale-75 lg:scale-100">
            <circle cx="20" cy="20" r="20" fill="white"/>
            <path d="M20 20L10 0H30L20 20Z" fill="#7C5DFA" />
          </svg>
        </Link>

        {/* Theme & Avatar Section */}
        <div className="flex items-center lg:flex-col lg:w-full">
          <button
            onClick={toggleTheme}
            className="p-6 transition-colors hover:text-[#DFE3FA] text-[#7E88C3] lg:p-10 lg:py-8"
            id="theme-toggle"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon size={20} fill="currentColor" stroke="none" />
            ) : (
              <Sun size={20} fill="currentColor" stroke="none" />
            )}
          </button>
          
          <div className="w-px h-20 bg-[#494E6E] lg:w-full lg:h-px" />
          
          <div className="p-6 lg:p-8">
            <div className="h-8 w-8 rounded-full overflow-hidden lg:h-10 lg:w-10 ring-1 ring-transparent hover:ring-primary transition-all">
              <img 
                src={avatar} 
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
