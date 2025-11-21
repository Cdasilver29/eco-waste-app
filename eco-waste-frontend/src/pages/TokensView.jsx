import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, TrendingUp, DollarSign, ArrowUpRight, ArrowDownLeft,
  Gift, Zap, Clock, Calendar, Download, Filter, Search,
  CheckCircle, XCircle, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { wasteAPI, municipalityAPI } from '../services/api';
import { toast } from 'react-toastify';

const TokensView = ({ user }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [showBalance, setShowBalance] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const tokenData = {
    balance: user?.tokens || 2450,
    valueInUSD: (user?.tokens || 0) * 0.1,
    earnedThisMonth: 450,
    spentThisMonth: 120,
    growth: 12.5
  };

  const tokenHistory = [
    { date: 'Jan 1', tokens: 2000, value: 200 },
    { date: 'Jan 8', tokens: 2150, value: 215 },
    { date: 'Jan 15', tokens: 2300, value: 230 },
    { date: 'Jan 22', tokens: 2400, value: 240 },
    { date: 'Jan 29', tokens: 2450, value: 245 },
  ];

  const transactions = [
    {
      id: 'TX-001',
      type: 'earned',
      amount: 50,
      description: 'Plastic waste logged - 12kg',
      category: 'waste-logging',
      date: '2024-01-15 14:30',
      status: 'completed',
      icon: Zap,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      id: 'TX-002',
      type: 'earned',
      amount: 100,
      description: 'Weekly recycling challenge completed',
      category: 'challenge',
      date: '2024-01-14 09:15',
      status: 'completed',
      icon: Gift,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'TX-003',
      type: 'spent',
      amount: -150,
      description: 'Redeemed for cash withdrawal',
      category: 'redemption',
      date: '2024-01-12 16:45',
      status: 'completed',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'TX-004',
      type: 'earned',
      amount: 200,
      description: 'Referral bonus - New user joined',
      category: 'referral',
      date: '2024-01-10 11:20',
      status: 'completed',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 'TX-005',
      type: 'earned',
      amount: 75,
      description: 'Organic waste collection - 8kg',
      category: 'waste-logging',
      date: '2024-01-08 08:30',
      status: 'completed',
      icon: Zap,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      id: 'TX-006',
      type: 'spent',
      amount: -25,
      description: 'Digital gift card purchase',
      category: 'redemption',
      date: '2024-01-05 13:15',
      status: 'completed',
      icon: Gift,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const quickActions = [
    { icon: DollarSign, label: 'Redeem Tokens', description: 'Convert to cash', action: 'redeem' },
    { icon: Gift, label: 'Buy Gift Cards', description: 'Popular brands', action: 'gift-cards' },
    { icon: TrendingUp, label: 'Earn More', description: 'Complete tasks', action: 'earn' },
    { icon: Download, label: 'Transaction History', description: 'Export records', action: 'export' }
  ];

  const stats = [
    { label: 'Total Earned', value: '3,240', change: '+15%', icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Total Redeemed', value: '790', change: '+8%', icon: DollarSign, color: 'text-blue-600' },
    { label: 'Active Streak', value: '15 days', change: 'Current', icon: Zap, color: 'text-orange-600' },
    { label: 'Monthly Goal', value: '85%', change: 'On track', icon: Target, color: 'text-purple-600' }
  ];

  const handleQuickAction = (action) => {
    switch (action) {
      case 'redeem':
        alert('Redirecting to redemption page...');
        break;
      case 'gift-cards':
        alert('Showing gift card options...');
        break;
      case 'earn':
        alert('Showing earning opportunities...');
        break;
      case 'export':
        alert('Exporting transaction history...');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">My Tokens</h1>
          <p className="text-slate-600">Manage your EcoWaste tokens and rewards</p>
        </div>
        <div className="flex items-center space-x-2">
          {['week', 'month', 'year'].map((range) => (
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
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-8 text-white"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-emerald-100 mb-2">Total Token Balance</p>
            <div className="flex items-center space-x-3">
              <h2 className="text-5xl font-bold">
                {showBalance ? tokenData.balance.toLocaleString() : '•••••'}
              </h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-emerald-100 mt-2">
              ≈ ${showBalance ? tokenData.valueInUSD.toFixed(2) : '•••'} USD
            </p>
          </div>
          <Coins className="w-16 h-16 opacity-50" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/20 rounded-xl p-4">
            <p className="text-emerald-100 text-sm mb-1">Earned This Month</p>
            <p className="text-2xl font-bold">+{tokenData.earnedThisMonth}</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <p className="text-emerald-100 text-sm mb-1">Spent This Month</p>
            <p className="text-2xl font-bold">-{tokenData.spentThisMonth}</p>
          </div>
        </div>

        <button className="w-full py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-2">
          <DollarSign className="w-5 h-5" />
          <span>Redeem Tokens</span>
        </button>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleQuickAction(action.action)}
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all text-left"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-3">
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">{action.label}</h3>
            <p className="text-sm text-slate-600">{action.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Charts and Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Token History Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-4">Token Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={tokenHistory}>
              <defs>
                <linearGradient id="tokenGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Area type="monotone" dataKey="tokens" stroke="#10b981" fill="url(#tokenGrowth)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm text-emerald-600 font-medium">{stat.change}</span>
              </div>
              <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Recent Transactions</h3>
          <button className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm">Export All</span>
          </button>
        </div>

        <div className="space-y-3">
          {transactions.map((transaction) => {
            const Icon = transaction.icon;
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                onClick={() => setSelectedTransaction(transaction)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${transaction.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${transaction.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{transaction.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-sm text-slate-500">{transaction.date}</span>
                      {transaction.status === 'completed' && (
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${
                    transaction.type === 'earned' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'earned' ? '+' : ''}{transaction.amount}
                  </span>
                  <p className="text-sm text-slate-500">tokens</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <button className="w-full mt-4 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-slate-400 hover:text-slate-800 transition-colors">
          View All Transactions
        </button>
      </motion.div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Transaction Details</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Amount:</span>
                <span className={`text-lg font-bold ${
                  selectedTransaction.type === 'earned' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {selectedTransaction.type === 'earned' ? '+' : ''}{selectedTransaction.amount} tokens
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Description:</span>
                <span className="text-slate-800">{selectedTransaction.description}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Date:</span>
                <span className="text-slate-800">{selectedTransaction.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Status:</span>
                <span className="text-emerald-600 font-medium">Completed</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TokensView;