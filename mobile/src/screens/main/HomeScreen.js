import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { fetchWasteStats } from '../../store/slices/wasteSlice';
import { scheduleAPI } from '../../services/api';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.waste);
  const [nextPickups, setNextPickups] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    dispatch(fetchWasteStats());
    try {
      const response = await scheduleAPI.getNextPickups();
      setNextPickups(response.data.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to load pickups');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const StatCard = ({ icon, label, value, color }) => (
    <View style={[styles.statCard, { backgroundColor: color + '15' }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10b981']} />
      }
    >  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BarChart3 className="w-10 h-10" />
          Your Impact
        </h1>
        <p className="text-emerald-100 text-lg">
          See the difference you're making for our planet 🌍
        </p>
      </motion.div>

      {/* Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {impactMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{metric.value}</p>
                </div>
                <div className={`${metric.bgColor} ${metric.color} p-4 rounded-xl`}>
                  {metric.icon}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Breakdown Pie Chart */}
        <Card title="Waste Breakdown" icon="📊">
          {breakdownData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>No data available yet</p>
            </div>
          )}
        </Card>

        {/* Activity Over Time */}
        <Card title="Activity Trend" icon="📈">
          {wasteStats?.recentActivity && wasteStats.recentActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={wasteStats.recentActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="_id" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>Start logging waste to see your trend!</p>
            </div>
          )}
        </Card>

        {/* AI Scan Categories */}
        {scanStats && scanStats.totalScans > 0 && (
          <Card title="AI Scan Categories" icon="📸">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" width={100} stroke="#6b7280" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* User Stats */}
        <Card title="Your Statistics" icon="📋" gradient>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-semibold">
                    {new Date(user?.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Level</p>
                  <p className="font-semibold">Level {user?.gamification.level}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Badges Earned</p>
                  <p className="font-semibold">{user?.gamification.badges.length} badges</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Longest Streak</p>
                  <p className="font-semibold">{user?.gamification.streak.longest} days</p>
                </div>
              </div>
            </div>

            {scanStats && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">📸</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">AI Scans</p>
                    <p className="font-semibold">{scanStats.totalScans} scans</p>
                  </div>
                </div>
              </div>
            )}

            {chatStats && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">💬</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chat Messages</p>
                    <p className="font-semibold">{chatStats.totalMessages} messages</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Achievements Section */}
      {user?.gamification.badges && user.gamification.badges.length > 0 && (
        <Card title="Recent Achievements" icon="🏆">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {user.gamification.badges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 hover:border-yellow-400 transition-colors"
              >
                <div className="text-4xl mb-2">🏅</div>
                <p className="text-xs text-gray-600">
                  {new Date(badge.earnedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Weekly Goal Progress */}
      <Card title="Weekly Goal" icon="🎯" gradient>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Recycling Goal</span>
              <span className="text-sm font-semibold text-green-600">
                {wasteStats?.summary.totalLogs || 0} / 10 items
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(((wasteStats?.summary.totalLogs || 0) / 10) * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Streak Goal</span>
              <span className="text-sm font-semibold text-orange-600">
                {user?.gamification.streak.current || 0} / 7 days
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(((user?.gamification.streak.current || 0) / 7) * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsPage;
