// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { id: 'dashboard', to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'log-waste', to: '/log-waste', icon: '📸', label: 'Log Waste' },
    { id: 'scan', to: '/scan', icon: '🔍', label: 'Scan' },
    { id: 'history', to: '/history', icon: '📜', label: 'History' },
    { id: 'map', to: '/map', icon: '🗺️', label: 'Find Facilities' },
    { id: 'schedule', to: '/schedule', icon: '📅', label: 'Schedule' },
    { id: 'leaderboard', to: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
    { id: 'stats', to: '/stats', icon: '📈', label: 'Stats' },
    { id: 'badges', to: '/badges', icon: '🏅', label: 'Badges' },
    { id: 'chat', to: '/chat', icon: '💬', label: 'AI Assistant' }
  ];

  // Helper function to check if a menu item is active
  const isActive = (to) => {
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 shadow-md overflow-y-auto">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({ isActive: navIsActive }) => 
              `block rounded-xl transition-all font-medium ${
                navIsActive 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            {({ isActive: navIsActive }) => (
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 px-4 py-3"
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
