// src/components/dashboard/ManufacturerDashboard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, CheckCircle, DollarSign, Star, TrendingUp, Users,
  MapPin, Phone, Video, MessageSquare, Filter, Plus, Eye,
  Truck, Calendar, Clock, AlertCircle, BarChart3, Target
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ManufacturerDashboard = ({ activeSection }) => {
  const [selectedWaste, setSelectedWaste] = useState(null);
  const [filterType, setFilterType] = useState('all');

  // Mock data
  const stats = {
    availableWaste: 48,
    completedOrders: 234,
    totalSaved: 12400,
    rating: 4.8,
    reviews: 156
  };

  const wasteItems = [
    {
      id: 1,
      type: 'Plastic',
      subType: 'PET Bottles',
      amount: '25 kg',
      quality: 'High',
      location: 'Nairobi CBD',
      distance: '2.4 km',
      price: '450 KES',
      poster: 'John Doe',
      phone: '+254 712 345 678',
      time: '10 min ago',
      verified: true,
      rating: 4.5,
      coordinates: { lat: -1.286389, lng: 36.817223 }
    },
    {
      id: 2,
      type: 'Metal',
      subType: 'Aluminum Cans',
      amount: '40 kg',
      quality: 'Medium',
      location: 'Westlands',
      distance: '5.1 km',
      price: '800 KES',
      poster: 'Jane Smith',
      phone: '+254 723 456 789',
      time: '25 min ago',
      verified: true,
      rating: 4.8,
      coordinates: { lat: -1.268, lng: 36.81 }
    },
    {
      id: 3,
      type: 'Paper',
      subType: 'Cardboard',
      amount: '15 kg',
      quality: 'High',
      location: 'Kilimani',
      distance: '3.7 km',
      price: '200 KES',
      poster: 'Mike Wilson',
      phone: '+254 734 567 890',
      time: '1 hour ago',
      verified: false,
      rating: 4.2,
      coordinates: { lat: -1.289, lng: 36.791 }
    },
    {
      id: 4,
      type: 'Plastic',
      subType: 'HDPE',
      amount: '30 kg',
      quality: 'High',
      location: 'Karen',
      distance: '8.2 km',
      price: '600 KES',
      poster: 'Sarah Johnson',
      phone: '+254 745 678 901',
      time: '2 hours ago',
      verified: true,
      rating: 4.9,
      coordinates: { lat: -1.319, lng: 36.708 }
    },
  ];

  const myOrders = [
    { id: 1, type: 'Plastic', amount: '50 kg', supplier: 'John Doe', status: 'In Transit', eta: '30 min' },
    { id: 2, type: 'Metal', amount: '75 kg', supplier: 'Jane Smith', status: 'Processing', eta: '2 hours' },
    { id: 3, type: 'Paper', amount: '20 kg', supplier: 'Mike Wilson', status: 'Scheduled', eta: 'Tomorrow' },
  ];

  const monthlyData = [
    { month: 'Jan', orders: 20, spent: 15000 },
    { month: 'Feb', orders: 25, spent: 18000 },
    { month: 'Mar', orders: 22, spent: 16500 },
    { month: 'Apr', orders: 30, spent: 22000 },
    { month: 'May', orders: 28, spent: 21000 },
    { month: 'Jun', orders: 35, spent: 26000 },
  ];

  const wasteTypeData = [
    { name: 'Plastic', value: 45, color: '#10b981' },
    { name: 'Metal', value: 30, color: '#3b82f6' },
    { name: 'Paper', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 10, color: '#8b5cf6' },
  ];

  const filteredWasteItems = filterType === 'all' 
    ? wasteItems 
    : wasteItems.filter(item => item.type.toLowerCase() === filterType.toLowerCase());

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Manufacturer Dashboard</h1>
          <p className="text-slate-600">Monitor waste availability and manage your orders</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>New Order</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Package} 
          label="Available Waste" 
          value={stats.availableWaste} 
          change="+6 new" 
          color="from-blue-400 to-indigo-500" 
        />
        <StatCard 
          icon={CheckCircle} 
          label="Completed Orders" 
          value={stats.completedOrders} 
          change="+12%" 
          color="from-emerald-400 to-teal-500" 
        />
        <StatCard 
          icon={DollarSign} 
          label="Total Saved" 
          value={`$${(stats.totalSaved / 1000).toFixed(1)}K`} 
          change="+18%" 
          color="from-green-400 to-emerald-500" 
        />
        <StatCard 
          icon={Star} 
          label="Rating" 
          value={stats.rating} 
          change={`${stats.reviews} reviews`} 
          color="from-yellow-400 to-orange-500" 
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4">Monthly Performance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4">Waste Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={wasteTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {wasteTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {wasteTypeData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-slate-700">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderWasteFeed = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Available Waste Feed</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterType === 'all' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('plastic')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterType === 'plastic' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Plastic
          </button>
          <button
            onClick={() => setFilterType('metal')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterType === 'metal' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Metal
          </button>
          <button
            onClick={() => setFilterType('paper')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterType === 'paper' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Paper
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredWasteItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ x: 5 }}
            className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-10 h-10 text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-bold text-slate-800">{item.type} Waste</h3>
                    {item.verified && (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.quality === 'High' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.quality} Quality
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{item.subType} • {item.amount}</p>
                  <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location} ({item.distance})</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.time}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{item.rating}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <span>Supplier: {item.poster}</span>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end space-y-3">
                <div className="text-2xl font-bold text-emerald-600">{item.price}</div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => alert(`Calling ${item.phone}`)}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    title="Call Supplier"
                  >
                    <Phone className="w-5 h-5 text-emerald-600" />
                  </button>
                  <button 
                    onClick={() => alert('Starting video call...')}
                    className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Video Call"
                  >
                    <Video className="w-5 h-5 text-blue-600" />
                  </button>
                  <button 
                    onClick={() => alert('Opening chat...')}
                    className="p-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                    title="Message"
                  >
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </button>
                  <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2">
                    <span>Order Now</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">My Orders</h1>
      
      <div className="grid gap-4">
        {myOrders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{order.type} • {order.amount}</h3>
                <p className="text-sm text-slate-600">Supplier: {order.supplier}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'In Transit' 
                  ? 'bg-blue-100 text-blue-700' 
                  : order.status === 'Processing' 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                <span>ETA: {order.eta}</span>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Track</span>
                </button>
                <button className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 rounded-lg text-sm font-medium text-emerald-700 transition-colors flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>Contact</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Route to correct section
  switch(activeSection) {
    case 'waste-feed':
      return renderWasteFeed();
    case 'orders':
      return renderOrders();
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

export default ManufacturerDashboard;