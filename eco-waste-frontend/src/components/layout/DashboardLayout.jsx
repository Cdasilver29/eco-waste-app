import React from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, LogOut, Menu, X, Bell, Search, Settings, Calendar,
  MessageSquare, MapPin, Package, TrendingUp, Users, Phone, Video,
  Truck, Camera, ChevronDown, BarChart3, Coins, Shield, Clock,
  Send, Star, CheckCircle, AlertCircle, Leaf, Award,
  Activity, DollarSign, Zap, Target, Plus, Building, User,
  Bot, Map, Navigation, Filter, Eye, Edit, Trash2
} from 'lucide-react';

const DashboardLayout = ({ 
  user = {}, 
  sidebarOpen, 
  setSidebarOpen, 
  activeSection, 
  setActiveSection,
  showChat,
  setShowChat,
  showAI,
  setShowAI,
  children 
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  const isCitizen = user?.role === 'citizen';
  const isManufacturer = user?.role === 'manufacturer';

  const navigationItems = {
    citizen: [
      { id: 'overview', label: 'Dashboard', icon: Home },
      { id: 'log-waste', label: 'Log Waste', icon: Camera },
      { id: 'track', label: 'Track Collection', icon: Truck },
      { id: 'schedule', label: 'Schedule', icon: Calendar },
      { id: 'map', label: 'Find Facilities', icon: MapPin },
      { id: 'tokens', label: 'My Tokens', icon: Coins },
      { id: 'rewards', label: 'Rewards', icon: Award },
      { id: 'history', label: 'History', icon: Clock },
      { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp },
    ],
    manufacturer: [
      { id: 'overview', label: 'Dashboard', icon: BarChart3 },
      { id: 'waste-feed', label: 'Waste Feed', icon: Package },
      { id: 'orders', label: 'My Orders', icon: Truck },
      { id: 'schedule', label: 'Schedule', icon: Calendar },
      { id: 'map', label: 'Waste Map', icon: MapPin },
      { id: 'suppliers', label: 'Suppliers', icon: Users },
      { id: 'analytics', label: 'Analytics', icon: TrendingUp },
      { id: 'inventory', label: 'Inventory', icon: Package },
    ]
  };

  const menuItems = isCitizen ? navigationItems.citizen : navigationItems.manufacturer;

  const notifications = [
    { id: 1, type: 'success', message: 'Your waste pickup is scheduled for tomorrow', time: '5 min ago' },
    { id: 2, type: 'info', message: 'New manufacturer interested in your plastic waste', time: '15 min ago' },
    { id: 3, type: 'warning', message: 'Complete your profile to earn bonus tokens', time: '1 hour ago' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleNavigation = (itemId) => {
    setActiveSection(itemId);
    if (itemId !== 'messages') setShowChat(false);
    if (itemId !== 'ai-assistant') setShowAI(false);
  };

  const userName = user?.name || 'User';
  const userEmail = user?.email || 'email@example.com';
  const userLevel = user?.level || 1;
  const userTokens = user?.tokens || 0;
  const userRating = user?.rating || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 shadow-sm">
        <div className="h-full px-4 flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hidden sm:inline">
                EcoWaste
              </span>
            </div>

            {/* Role Badge */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-full">
              {isCitizen ? (
                <>
                  <User className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">Citizen</span>
                </>
              ) : (
                <>
                  <Building className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Manufacturer</span>
                </>
              )}
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-slate-100 rounded-lg px-4 py-2 w-80">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm w-full text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* AI Assistant Button */}
            <button
              onClick={() => {
                setShowAI(!showAI);
                if (!showAI) setShowChat(false); // close chat when AI opens
              }}
              className="p-2 hover:bg-emerald-100 rounded-lg transition-colors relative"
              title="AI Assistant"
            >
              <Bot className="w-5 h-5 text-emerald-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </button>

            {/* Messages Button */}
            <button
              onClick={() => {
                setShowChat(!showChat);
                if (!showChat) setShowAI(false); // close AI when chat opens
              }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 hover:bg-slate-50 border-b border-slate-100 cursor-pointer transition-colors"
                      >
                        <p className="text-sm text-slate-800">{notif.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-600 hidden sm:block" />
              </button>

              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                    <p className="font-semibold text-slate-800">{userName}</p>
                    <p className="text-sm text-slate-600">{userEmail}</p>
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full font-medium ${
                      isCitizen ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {isCitizen ? '🌱 Citizen' : '🏭 Manufacturer'}
                    </span>
                  </div>

                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-lg transition-colors text-left">
                      <User className="w-5 h-5 text-slate-600" />
                      <span className="text-slate-700">Profile</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-lg transition-colors text-left">
                      <Settings className="w-5 h-5 text-slate-600" />
                      <span className="text-slate-700">Settings</span>
                    </button>
                    <div className="border-t border-slate-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 rounded-lg transition-colors text-left text-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 right-4 w-96 max-h-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-y-auto z-50"
          >
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">AI Assistant</h3>
            </div>
            <div className="p-4">
              <p className="text-slate-600 text-sm">Hello! How can I help you today?</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-4 w-96 max-h-[calc(100vh-4rem)] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-y-auto z-50"
          >
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Messages</h3>
            </div>
            <div className="p-4">
              <p className="text-slate-600 text-sm">No new messages</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 z-40 shadow-lg overflow-y-auto"
          >
            <div className="p-4">
              {/* User Stats Card */}
              <div className="mb-6 p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white shadow-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">{userName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{userName}</p>
                    <p className="text-emerald-100 text-sm">Level {userLevel}</p>
                  </div>
                </div>
                {isCitizen && (
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <div>
                      <p className="text-emerald-100 text-xs">Tokens</p>
                      <p className="text-xl font-bold">{userTokens}</p>
                    </div>
                    <Coins className="w-6 h-6" />
                  </div>
                )}
                {isManufacturer && (
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <div>
                      <p className="text-emerald-100 text-xs">Rating</p>
                      <p className="text-xl font-bold">{userRating} ⭐</p>
                    </div>
                    <Star className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Navigation Menu */}
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-emerald-600" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      setShowAI(true);
                      setShowChat(false);
                    }}
                    className="w-full px-3 py-2 bg-white hover:bg-emerald-50 rounded-lg text-sm text-slate-700 transition-colors flex items-center space-x-2 shadow-sm"
                  >
                    <Bot className="w-4 h-4 text-emerald-600" />
                    <span>AI Assistant</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowChat(true);
                      setShowAI(false);
                    }}
                    className="w-full px-3 py-2 bg-white hover:bg-emerald-50 rounded-lg text-sm text-slate-700 transition-colors flex items-center space-x-2 shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Messages</span>
                  </button>
                  {isCitizen && (
                    <button 
                      onClick={() => handleNavigation('log-waste')}
                      className="w-full px-3 py-2 bg-white hover:bg-emerald-50 rounded-lg text-sm text-slate-700 transition-colors flex items-center space-x-2 shadow-sm"
                    >
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>Log Waste</span>
                    </button>
                  )}
                  {isManufacturer && (
                    <button 
                      onClick={() => handleNavigation('waste-feed')}
                      className="w-full px-3 py-2 bg-white hover:bg-emerald-50 rounded-lg text-sm text-slate-700 transition-colors flex items-center space-x-2 shadow-sm"
                    >
                      <Package className="w-4 h-4 text-emerald-600" />
                      <span>Browse Waste</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`pt-20 pb-8 transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-0'}`}>
        <div className="px-4 md:px-6 lg:px-8 max-w-screen-2xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

