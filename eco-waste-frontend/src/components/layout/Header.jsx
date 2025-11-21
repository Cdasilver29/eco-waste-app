//src/components/layout/Header.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { logout } from '../../store/slices/authSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-3xl">♻️</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                EcoWaste
              </h1>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Points display */}
            {user?.gamification && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg"
              >
                <span className="text-xl">🏆</span>
                <span>{user.gamification.points} pts</span>
                <span className="text-xs opacity-80">Level {user.gamification.level}</span>
              </motion.div>
            )}

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.profile.firstName?.[0]}
                </div>
              </button>

              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50"
                >
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold text-gray-800">
                      {user?.profile.firstName} {user?.profile.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
