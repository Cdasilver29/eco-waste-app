import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, Calendar, Clock, MapPin, Phone, MessageSquare, 
  CheckCircle, AlertCircle, Package, Search, Filter,
  ChevronDown, Eye, Download, RefreshCw
} from 'lucide-react';

const ManufacturerOrders = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: 'ORD-001',
      type: 'Plastic PET Bottles',
      supplier: 'John Doe',
      amount: '50 kg',
      price: 'KES 1,250',
      status: 'in-transit',
      statusText: 'In Transit',
      progress: 75,
      pickupDate: '2024-01-15',
      deliveryDate: '2024-01-16',
      driver: 'James Kamau',
      vehicle: 'KBR 234X',
      contact: '+254 712 345 678',
      location: 'Nairobi CBD',
      coordinates: { lat: -1.286389, lng: 36.817223 },
      items: [
        { material: 'PET Bottles', quantity: '30 kg', quality: 'A Grade' },
        { material: 'HDPE', quantity: '20 kg', quality: 'B Grade' }
      ],
      timeline: [
        { step: 'Order Placed', time: '2024-01-14 09:30', completed: true },
        { step: 'Confirmed', time: '2024-01-14 10:15', completed: true },
        { step: 'Picked Up', time: '2024-01-15 08:00', completed: true },
        { step: 'In Transit', time: '2024-01-15 11:30', completed: true },
        { step: 'Delivery', time: '2024-01-16 14:00', completed: false }
      ]
    },
    {
      id: 'ORD-002',
      type: 'Aluminum Cans',
      supplier: 'GreenTech Recycling',
      amount: '75 kg',
      price: 'KES 2,850',
      status: 'processing',
      statusText: 'Processing',
      progress: 40,
      pickupDate: '2024-01-16',
      deliveryDate: '2024-01-17',
      driver: 'Mary Wanjiku',
      vehicle: 'KCN 567Y',
      contact: '+254 723 456 789',
      location: 'Industrial Area',
      coordinates: { lat: -1.268, lng: 36.81 },
      items: [
        { material: 'Aluminum Cans', quantity: '75 kg', quality: 'A Grade' }
      ],
      timeline: [
        { step: 'Order Placed', time: '2024-01-15 14:20', completed: true },
        { step: 'Confirmed', time: '2024-01-15 15:00', completed: true },
        { step: 'Processing', time: '2024-01-16 08:00', completed: true },
        { step: 'Ready for Pickup', time: '2024-01-16 12:00', completed: false },
        { step: 'Delivery', time: '2024-01-17 10:00', completed: false }
      ]
    },
    {
      id: 'ORD-003',
      type: 'Cardboard & Paper',
      supplier: 'EcoPack Solutions',
      amount: '120 kg',
      price: 'KES 1,800',
      status: 'completed',
      statusText: 'Completed',
      progress: 100,
      pickupDate: '2024-01-12',
      deliveryDate: '2024-01-13',
      driver: 'Peter Omondi',
      vehicle: 'KDM 890Z',
      contact: '+254 734 567 890',
      location: 'Westlands',
      coordinates: { lat: -1.268, lng: 36.81 },
      items: [
        { material: 'Cardboard', quantity: '80 kg', quality: 'A Grade' },
        { material: 'Office Paper', quantity: '40 kg', quality: 'B Grade' }
      ],
      timeline: [
        { step: 'Order Placed', time: '2024-01-11 11:15', completed: true },
        { step: 'Confirmed', time: '2024-01-11 12:00', completed: true },
        { step: 'Picked Up', time: '2024-01-12 09:30', completed: true },
        { step: 'In Transit', time: '2024-01-12 13:45', completed: true },
        { step: 'Delivered', time: '2024-01-13 15:20', completed: true }
      ]
    },
    {
      id: 'ORD-004',
      type: 'Mixed Plastics',
      supplier: 'Community Recycling Hub',
      amount: '35 kg',
      price: 'KES 875',
      status: 'pending',
      statusText: 'Pending',
      progress: 20,
      pickupDate: '2024-01-18',
      deliveryDate: '2024-01-19',
      driver: 'To be assigned',
      vehicle: 'To be assigned',
      contact: '+254 745 678 901',
      location: 'Kilimani',
      coordinates: { lat: -1.289, lng: 36.791 },
      items: [
        { material: 'Mixed Plastics', quantity: '35 kg', quality: 'C Grade' }
      ],
      timeline: [
        { step: 'Order Placed', time: '2024-01-15 16:45', completed: true },
        { step: 'Pending Confirmation', time: '2024-01-16 09:00', completed: false },
        { step: 'Scheduled', time: '2024-01-18 08:00', completed: false },
        { step: 'Delivery', time: '2024-01-19 11:00', completed: false }
      ]
    }
  ];

  const statusFilters = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { id: 'in-transit', label: 'In Transit', count: orders.filter(o => o.status === 'in-transit').length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-transit': return Truck;
      case 'processing': return RefreshCw;
      case 'pending': return Clock;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">My Orders</h1>
          <p className="text-slate-600">Manage and track your waste material orders</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2">
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders by ID, material, or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="flex space-x-2 overflow-x-auto">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterStatus(filter.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  filterStatus === filter.id
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-6">
        {filteredOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="p-6">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                  <div className="flex items-center space-x-3 mb-4 lg:mb-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{order.type}</h3>
                      <p className="text-sm text-slate-600">Order ID: {order.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)} flex items-center space-x-1`}>
                      <StatusIcon className="w-4 h-4" />
                      <span>{order.statusText}</span>
                    </span>
                    <button 
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform ${selectedOrder?.id === order.id ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Pickup: {order.pickupDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Delivery: {order.deliveryDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Truck className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{order.driver}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{order.location}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Order Progress</span>
                    <span>{order.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all"
                      style={{ width: `${order.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition-colors flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Call Driver</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                  <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>Track Order</span>
                  </button>
                </div>

                {/* Expanded Details */}
                {selectedOrder?.id === order.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t border-slate-200"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3">Order Details</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                              <div>
                                <p className="font-medium text-slate-800">{item.material}</p>
                                <p className="text-sm text-slate-600">{item.quality}</p>
                              </div>
                              <span className="font-semibold text-slate-800">{item.quantity}</span>
                            </div>
                          ))}
                          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                            <span className="font-semibold text-slate-800">Total</span>
                            <span className="font-bold text-lg text-emerald-600">{order.price}</span>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3">Order Timeline</h4>
                        <div className="space-y-3">
                          {order.timeline.map((step, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                step.completed 
                                  ? 'bg-emerald-500 text-white' 
                                  : 'bg-slate-300 text-slate-600'
                              }`}>
                                {step.completed && <CheckCircle className="w-4 h-4" />}
                              </div>
                              <div className="flex-1">
                                <p className={`font-medium ${
                                  step.completed ? 'text-slate-800' : 'text-slate-500'
                                }`}>
                                  {step.step}
                                </p>
                                <p className="text-sm text-slate-500">{step.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No orders found</h3>
          <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ManufacturerOrders;