import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  TrendingUp, 
  Award, 
  Calendar,
  Leaf,
  Zap,
  Target,
  Star
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { fetchWasteStats } from '../store/slices/wasteSlice';
import { scheduleAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.waste);
  const [nextPickups, setNextPickups] = useState([]);

  useEffect(() => {
    dispatch(fetchWasteStats());
    loadNextPickups();
  }, [dispatch]);

  const loadNextPickups = async () => {
    try {
      const response = await scheduleAPI.getNextPickups();
      setNextPickups(response.data.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to load pickups');
    }
  };

  const statCards = [
    {
      icon: <Trash2 className="w-6 h-6" />,
      label: 'Total Logs',
      value: stats?.summary.totalLogs || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      label: 'Weight Recycled',
      value: `${stats?.summary.totalWeight || 0} kg`,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'Current Streak',
      value: `${user?.gamification.streak.current || 0} days`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: <Star className="w-6 h-6" />,
      label: 'Total Points',
      value: user?.gamification.points || 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.profile.firstName}! 👋
        </h1>
        <p className="text-green-100 text-lg">
          You're making a real difference for our planet 🌍
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-4 rounded-xl`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <Card title="Recent Activity" icon="📊" className="lg:col-span-2">
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.recentActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="_id" 
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Trash2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Start logging waste to see your activity!</p>
              </div>
            </div>
          )}
        </Card>

        {/* Next Pickups */}
        <Card title="Next Pickups" icon="🗓️">
          <div className="space-y-3">
            {nextPickups.length > 0 ? (
              nextPickups.map((pickup, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {pickup.wasteType}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(pickup.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-500">{pickup.time}</p>
                  </div>
                  <Badge variant="success" size="sm">
                    {pickup.zone}
                  </Badge>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No upcoming pickups</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Badges Section */}
      {user?.gamification.badges && user.gamification.badges.length > 0 && (
        <Card title="Recent Badges" icon="🏆">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.gamification.badges.slice(0, 4).map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200"
              >
                <div className="text-4xl mb-2">🏅</div>
                <p className="font-semibold text-gray-800 text-sm">
                  Achievement
                </p>
                <p className="text-xs text-gray-600">
                  {new Date(badge.earnedAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card title="Quick Actions" icon="⚡">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => window.location.href = '/log-waste'}
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Log Waste
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => window.location.href = '/scan'}
          >
            📸 Scan Item
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => window.location.href = '/chat'}
          >
            💬 Ask AI
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
