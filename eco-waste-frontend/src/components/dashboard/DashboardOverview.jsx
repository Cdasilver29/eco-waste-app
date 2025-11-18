import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Flame, Target, Recycle, Leaf, Calendar, MapPin } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DashboardOverview = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with real API data
  const userStats = {
    totalPoints: 2450,
    currentLevel: 12,
    currentStreak: 15,
    totalWasteLogged: 145.5,
    rank: 23,
    badges: 8
  };

  const wasteData = [
    { date: 'Mon', recyclable: 12, organic: 8, general: 5 },
    { date: 'Tue', recyclable: 15, organic: 10, general: 6 },
    { date: 'Wed', recyclable: 18, organic: 12, general: 4 },
    { date: 'Thu', recyclable: 14, organic: 9, general: 7 },
    { date: 'Fri', recyclable: 20, organic: 15, general: 5 },
    { date: 'Sat', recyclable: 25, organic: 18, general: 8 },
    { date: 'Sun', recyclable: 22, organic: 16, general: 6 }
  ];

  const categoryData = [
    { name: 'Recyclable', value: 45, color: '#10b981' },
    { name: 'Organic', value: 30, color: '#f59e0b' },
    { name: 'General', value: 15, color: '#6366f1' },
    { name: 'Hazardous', value: 10, color: '#ef4444' }
  ];

  const impactData = [
    { month: 'Jan', co2: 45, trees: 12 },
    { month: 'Feb', co2: 52, trees: 15 },
    { month: 'Mar', co2: 48, trees: 13 },
    { month: 'Apr', co2: 65, trees: 18 },
    { month: 'May', co2: 72, trees: 20 },
    { month: 'Jun', co2: 85, trees: 24 }
  ];

  const achievements = [
    { icon: Flame, title: 'Hot Streak', value: '15 days', color: 'from-orange-400 to-red-600' },
    { icon: Target, title: 'Weekly Goal', value: '85%', color: 'from-blue-400 to-indigo-600' },
    { icon: TrendingUp, title: 'Growth', value: '+24%', color: 'from-emerald-400 to-teal-600' },
    { icon: Award, title: 'Rank', value: '#23', color: 'from-purple-400 to-pink-600' }
  ];

  const upcomingPickups = [
    { type: 'Recyclables', date: 'Tomorrow, 8:00 AM', zone: 'Zone A' },
    { type: 'Organic Waste', date: 'Nov 18, 7:30 AM', zone: 'Zone B' },
    { type: 'General Waste', date: 'Nov 20, 9:00 AM', zone: 'Zone A' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Welcome back, <span className="text-emerald-600">Eco Warrior! 🌱</span>
            </h1>
            <p className="text-slate-600">Track your impact and continue making a difference</p>
          </div>
          
          <div className="flex space-x-2">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative overflow-hidden"
            >
              <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                <div className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center mb-4`}>
                  <achievement.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-slate-600 mb-1">{achievement.title}</div>
                <div className="text-3xl font-bold text-slate-800">{achievement.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Waste Tracking Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Weekly Waste Tracking</h2>
              <div className="flex space-x-2">
                <span className="flex items-center space-x-1 text-sm">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-600">Recyclable</span>
                </span>
                <span className="flex items-center space-x-1 text-sm">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-slate-600">Organic</span>
                </span>
                <span className="flex items-center space-x-1 text-sm">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className="text-slate-600">General</span>
                </span>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={wasteData}>
                <defs>
                  <linearGradient id="recyclable" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="organic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="general" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Area type="monotone" dataKey="recyclable" stroke="#10b981" strokeWidth={2} fill="url(#recyclable)" />
                <Area type="monotone" dataKey="organic" stroke="#f59e0b" strokeWidth={2} fill="url(#organic)" />
                <Area type="monotone" dataKey="general" stroke="#6366f1" strokeWidth={2} fill="url(#general)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Waste Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Waste Categories</h2>
            
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3 mt-4">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }}></div>
                    <span className="text-slate-700">{category.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{category.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Environmental Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Environmental Impact</h2>
            
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={impactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="co2" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="trees" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-emerald-50 rounded-xl">
                <div className="text-sm text-emerald-700 mb-1">CO₂ Reduced</div>
                <div className="text-2xl font-bold text-emerald-600">367 kg</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="text-sm text-blue-700 mb-1">Trees Equivalent</div>
                <div className="text-2xl font-bold text-blue-600">102 🌳</div>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Pickups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Upcoming Pickups</h2>
            
            <div className="space-y-4">
              {upcomingPickups.map((pickup, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Recycle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{pickup.type}</div>
                        <div className="flex items-center space-x-2 mt-1 text-sm text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span>{pickup.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1 text-sm text-slate-600">
                          <MapPin className="w-4 h-4" />
                          <span>{pickup.zone}</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                      Remind
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              View Full Schedule
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;