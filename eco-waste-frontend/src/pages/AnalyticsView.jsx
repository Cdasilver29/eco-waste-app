import React, { useState } from 'react'; 
import { motion } from 'framer-motion';
import { 
  TrendingUp, BarChart3, PieChart, Target, DollarSign, 
  Package, Users, Calendar, Filter, Download, RefreshCw,
  Eye, EyeOff, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart as RechartPie, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const AnalyticsView = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [activeMetric, setActiveMetric] = useState('revenue');

  const analyticsData = {
    overview: {
      totalRevenue: 12450,
      totalOrders: 234,
      activeSuppliers: 48,
      wasteProcessed: 1250,
      revenueGrowth: 18.2,
      orderGrowth: 12.5,
      supplierGrowth: 8.3,
      wasteGrowth: 15.7
    },
    monthlyPerformance: [
      { month: 'Jan', revenue: 15000, orders: 45, efficiency: 85 },
      { month: 'Feb', revenue: 18000, orders: 52, efficiency: 88 },
      { month: 'Mar', revenue: 16500, orders: 48, efficiency: 86 },
      { month: 'Apr', revenue: 22000, orders: 65, efficiency: 90 },
      { month: 'May', revenue: 21000, orders: 60, efficiency: 89 },
      { month: 'Jun', revenue: 26000, orders: 75, efficiency: 92 },
    ],
    wasteDistribution: [
      { name: 'Plastic', value: 45, color: '#10b981' },
      { name: 'Metal', value: 30, color: '#3b82f6' },
      { name: 'Paper', value: 15, color: '#f59e0b' },
      { name: 'Glass', value: 6, color: '#8b5cf6' },
      { name: 'Organic', value: 4, color: '#ef4444' }
    ],
    supplierPerformance: [
      { name: 'GreenTech', orders: 45, rating: 4.8, efficiency: 92 },
      { name: 'EcoRecycle', orders: 38, rating: 4.6, efficiency: 88 },
      { name: 'Community Hub', orders: 32, rating: 4.9, efficiency: 95 },
      { name: 'Urban Waste', orders: 28, rating: 4.4, efficiency: 85 },
      { name: 'Clean Earth', orders: 25, rating: 4.7, efficiency: 90 }
    ],
    costSavings: [
      { month: 'Jan', materialCost: 12000, traditionalCost: 18000, savings: 6000 },
      { month: 'Feb', materialCost: 14000, traditionalCost: 21000, savings: 7000 },
      { month: 'Mar', materialCost: 13000, traditionalCost: 19500, savings: 6500 },
      { month: 'Apr', materialCost: 16000, traditionalCost: 24000, savings: 8000 },
      { month: 'May', materialCost: 15500, traditionalCost: 23250, savings: 7750 },
      { month: 'Jun', materialCost: 18000, traditionalCost: 27000, savings: 9000 }
    ]
  };

  const metrics = [
    { id: 'revenue', label: 'Revenue', value: `$${(analyticsData.overview.totalRevenue / 1000).toFixed(1)}K`, change: analyticsData.overview.revenueGrowth, icon: DollarSign, color: 'text-emerald-600' },
    { id: 'orders', label: 'Total Orders', value: analyticsData.overview.totalOrders, change: analyticsData.overview.orderGrowth, icon: Package, color: 'text-blue-600' },
    { id: 'suppliers', label: 'Active Suppliers', value: analyticsData.overview.activeSuppliers, change: analyticsData.overview.supplierGrowth, icon: Users, color: 'text-purple-600' },
    { id: 'waste', label: 'Waste Processed', value: `${(analyticsData.overview.wasteProcessed / 1000).toFixed(1)} tons`, change: analyticsData.overview.wasteGrowth, icon: TrendingUp, color: 'text-orange-600' }
  ];

  const kpis = [
    { label: 'Avg Order Value', value: '$532', trend: 'up', change: '+5.2%' },
    { label: 'Supplier Rating', value: '4.7/5', trend: 'up', change: '+0.3' },
    { label: 'Processing Efficiency', value: '89%', trend: 'up', change: '+4%' },
    { label: 'Cost Savings', value: '$44.2K', trend: 'up', change: '+18%' }
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Manufacturing Analytics</h1>
          <p className="text-slate-600">Comprehensive insights into your waste processing operations</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {['week', 'month', 'quarter', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>

          <button className="p-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <div className={`flex items-center space-x-1 text-sm ${
                  metric.change > 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {metric.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4" />
                  )}
                  <span>{metric.change}%</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Monthly Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Monthly Performance</h3>

            <div className="flex space-x-2">
              <button
                onClick={() => setActiveMetric('revenue')}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  activeMetric === 'revenue'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Revenue
              </button>

              <button
                onClick={() => setActiveMetric('orders')}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  activeMetric === 'orders'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Orders
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey={activeMetric === 'revenue' ? 'revenue' : 'orders'}
                stroke={activeMetric === 'revenue' ? '#10b981' : '#3b82f6'}
                strokeWidth={3}
                dot={{ fill: activeMetric === 'revenue' ? '#10b981' : '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Waste Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-6">Waste Material Distribution</h3>

          <div className="flex items-center justify-center h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartPie>
                <Pie
                  data={analyticsData.wasteDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {analyticsData.wasteDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartPie>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {analyticsData.wasteDistribution.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-700">{item.name}</span>
                <span className="ml-auto text-sm text-slate-800 font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Cost Savings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-6">Cost Savings Analysis</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.costSavings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />

              <Bar dataKey="materialCost" fill="#3b82f6" name="Recycled Material Cost" />
              <Bar dataKey="traditionalCost" fill="#ef4444" name="Traditional Cost" />
              <Bar dataKey="savings" fill="#10b981" name="Savings" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Supplier Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-6">Top Supplier Performance</h3>

          <div className="space-y-4">
            {analyticsData.supplierPerformance.map((supplier, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <p className="text-lg font-semibold text-slate-800">{supplier.name}</p>
                  <p className="text-sm text-slate-600">Orders: {supplier.orders}</p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-600">Rating</p>
                  <p className="text-lg font-bold text-emerald-600">{supplier.rating}</p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-600">Efficiency</p>
                  <p className="text-lg font-bold text-blue-600">{supplier.efficiency}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default AnalyticsView;
