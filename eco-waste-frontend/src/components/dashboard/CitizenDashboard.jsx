// src/components/dashboard/CitizenDashboard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, Truck, MapPin, Coins, Shield, Clock, 
  TrendingUp, Award, Flame, Target, CheckCircle,
  Activity, Leaf, Calendar, Navigation, Phone, Video
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CitizenDashboard = ({ activeSection }) => {
  const [trackingActive, setTrackingActive] = useState(false);

  // Mock data - FIXED DUPLICATE KEY
  const userStats = {
    totalPoints: 2450,
    wasteLogged: 145.5,
    rank: 23,
    streak: 15,
    badges: 8,
    level: 12
  };

  const wasteData = [
    { date: 'Mon', recyclable: 12, organic: 8, general: 5 },
    { date: 'Tue', recyclable: 15, organic: 10, general: 6 },
    { date: 'Wed', recyclable: 18, organic: 12, general: 4 },
    { date: 'Thu', recyclable: 14, organic: 9, general: 7 },
    { date: 'Fri', recyclable: 20, organic: 15, general: 5 },
    { date: 'Sat', recyclable: 25, organic: 18, general: 8 },
    { date: 'Sun', recyclable: 22, organic: 16, general: 6 } // FIXED: Changed second "organic" to "general"
  ];

  const recentActivities = [
    { id: 1, action: 'Logged 12kg plastic waste', tokens: 50, time: '2 hours ago', icon: CheckCircle },
    { id: 2, action: 'Waste collected successfully', tokens: 100, time: '5 hours ago', icon: Truck },
    { id: 3, action: 'Earned Bronze Recycler badge', tokens: 200, time: '1 day ago', icon: Award },
  ];

  const upcomingCollections = [
    { id: 1, type: 'Recyclables', date: 'Tomorrow, 8:00 AM', zone: 'Zone A', driver: 'James Kamau' },
    { id: 2, type: 'Organic Waste', date: 'Nov 18, 7:30 AM', zone: 'Zone B', driver: 'Mary Wanjiru' },
  ];

  const badges = [
    { name: 'Eco Warrior', icon: '🌟', earned: true, date: 'Nov 10, 2024' },
    { name: 'Recycling Pro', icon: '♻️', earned: true, date: 'Nov 5, 2024' },
    { name: 'Green Champion', icon: '🏆', earned: false, progress: 75 },
    { name: 'Waste Reducer', icon: '🎯', earned: false, progress: 50 },
  ];

  // Render different sections
  const renderOverview = () => (
    <div className="space-y-6 w-full">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Welcome back, <span className="text-emerald-600">Eco Warrior! 🌱</span>
        </h1>
        <p className="text-slate-600">Track your impact and continue making a difference</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <StatCard icon={Coins} label="Total Tokens" value={userStats.totalPoints} change="+12%" color="from-yellow-400 to-orange-500" />
        <StatCard icon={Truck} label="Waste Logged" value={`${userStats.wasteLogged} kg`} change="+8%" color="from-emerald-400 to-teal-500" />
        <StatCard icon={Award} label="Current Rank" value={`#${userStats.rank}`} change="+5" color="from-purple-400 to-pink-500" />
        <StatCard icon={Flame} label="Streak Days" value={userStats.streak} change="Active" color="from-orange-400 to-red-500" />
      </div>

      {/* Charts and Activity */}
      <div className="grid lg:grid-cols-2 gap-6 w-full">
        {/* Waste Tracking Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 w-full"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4">Weekly Waste Tracking</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={wasteData}>
              <defs>
                <linearGradient id="recyclable" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Area type="monotone" dataKey="recyclable" stroke="#10b981" fill="url(#recyclable)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 w-full"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <activity.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
                <span className="text-sm font-semibold text-emerald-600">+{activity.tokens}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderTracking = () => (
    <div className="space-y-6 w-full">
      <h1 className="text-3xl font-bold text-slate-800">Track Collection</h1>
      
      {/* Live Tracking Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 w-full"
      >
        <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center mb-6">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Live tracking map will appear here</p>
            <button 
              onClick={() => setTrackingActive(!trackingActive)}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {trackingActive ? 'Stop Tracking' : 'Start Tracking'}
            </button>
          </div>
        </div>

        {trackingActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-3 gap-4"
          >
            <div className="p-4 bg-emerald-50 rounded-xl">
              <p className="text-sm text-emerald-700 mb-1">Driver</p>
              <p className="font-semibold text-emerald-900">James Kamau</p>
              <div className="flex space-x-2 mt-3">
                <button className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm flex items-center justify-center space-x-1 hover:bg-emerald-700 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
                <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center justify-center space-x-1 hover:bg-blue-700 transition-colors">
                  <Video className="w-4 h-4" />
                  <span>Video</span>
                </button>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-700 mb-1">ETA</p>
              <p className="text-2xl font-bold text-blue-900">12 min</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-purple-700 mb-1">Distance</p>
              <p className="text-2xl font-bold text-purple-900">2.4 km</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Upcoming Collections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 w-full"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-4">Upcoming Collections</h2>
        <div className="space-y-4">
          {upcomingCollections.map((collection) => (
            <div key={collection.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800">{collection.type}</h3>
                  <div className="flex items-center space-x-2 mt-1 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>{collection.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{collection.zone}</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors">
                  Track
                </button>
              </div>
              <div className="flex items-center space-x-2 pt-3 border-t border-slate-200">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Truck className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm text-slate-700">Driver: {collection.driver}</span>
                <div className="flex space-x-1 ml-auto">
                  <button className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors">
                    <Phone className="w-4 h-4 text-slate-700" />
                  </button>
                  <button className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors">
                    <Video className="w-4 h-4 text-slate-700" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderBadges = () => (
    <div className="space-y-6 w-full">
      <h1 className="text-3xl font-bold text-slate-800">Badges & Rewards</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-2xl shadow-lg border-2 ${
              badge.earned 
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300' 
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="text-5xl mb-4 text-center">{badge.icon}</div>
            <h3 className="font-bold text-slate-800 text-center mb-2">{badge.name}</h3>
            {badge.earned ? (
              <p className="text-xs text-slate-600 text-center">Earned: {badge.date}</p>
            ) : (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Progress</span>
                  <span>{badge.progress}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all"
                    style={{ width: `${badge.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Route to correct section
  switch(activeSection) {
    case 'track':
      return renderTracking();
    case 'badges':
      return renderBadges();
    default:
      return renderOverview();
  }
};

// Reusable Stat Card Component
const StatCard = ({ icon: Icon, label, value, change, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="relative overflow-hidden group"
  >
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-sm text-slate-600 mb-1">{label}</div>
      <div className="text-3xl font-bold text-slate-800 mb-2">{value}</div>
      <div className="text-sm text-emerald-600 font-medium">{change}</div>
    </div>
  </motion.div>
);

export default CitizenDashboard;