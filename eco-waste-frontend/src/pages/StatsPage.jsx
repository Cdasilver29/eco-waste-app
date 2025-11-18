import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Zap, Award } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { wasteAPI, imageAPI, chatAPI } from '../services/api';
import { useSelector } from 'react-redux';

const StatsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [wasteStats, setWasteStats] = useState(null);
  const [scanStats, setScanStats] = useState(null);
  const [chatStats, setChatStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = async () => {
    setLoading(true);
    try {
      const [waste, scan, chat] = await Promise.all([
        wasteAPI.getStats(),
        imageAPI.getStats(),
        chatAPI.getStats()
      ]);

      setWasteStats(waste.data.data);
      setScanStats(scan.data.data);
      setChatStats(chat.data.data);
    } catch (error) {
      console.error('Failed to load stats', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const breakdownData = wasteStats?.summary.breakdown.map(item => ({
    name: item._id,
    value: item.count,
    weight: item.weight
  })) || [];

  const categoryData = scanStats?.categoryBreakdown.map(item => ({
    name: item._id.replace('_', ' '),
    count: item.count
  })) || [];

  const impactMetrics = [
    {
      icon: <Leaf className="w-6 h-6" />,
      label: 'CO2 Saved',
      value: `${((wasteStats?.summary.totalWeight || 0) * 2.5).toFixed(1)} kg`,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'Energy Saved',
      value: `${((wasteStats?.summary.totalWeight || 0) * 1.2).toFixed(1)} kWh`,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: 'Trees Saved',
      value: Math.floor((wasteStats?.summary.totalWeight || 0) * 0.05),
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700">Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {impactMetrics.map((metric, idx) => (
          <Card key={idx} className="flex items-center p-4">
            <div className={`p-3 rounded-full ${metric.bgColor} mr-4`}>
              {metric.icon}
            </div>
            <div>
              <p className="text-gray-500">{metric.label}</p>
              <p className={`text-lg font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Waste Breakdown */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Waste Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={breakdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="weight" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Scanned Items Category */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Scanned Items</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={categoryData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Chat Stats */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Chat Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chatStats?.history || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="messages" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default StatsPage;
