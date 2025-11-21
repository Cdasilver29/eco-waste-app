import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, MapPin, Clock, Star, Phone, Video, MessageSquare } from 'lucide-react';


const WasteFeed = () => {
  const [filterType, setFilterType] = useState('all');

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
      time: '10 min ago',
      verified: true,
      rating: 4.5,
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
      time: '25 min ago',
      verified: true,
      rating: 4.8,
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
      time: '1 hour ago',
      verified: false,
      rating: 4.2,
    },
  ];

  const filteredItems = filterType === 'all' 
    ? wasteItems 
    : wasteItems.filter(item => item.type.toLowerCase() === filterType.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Available Waste Feed</h1>
        <div className="flex space-x-2">
          {['all', 'plastic', 'metal', 'paper'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === type 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ x: 5 }}
            className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-300 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
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
                  <button className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
                    <Phone className="w-5 h-5 text-emerald-600" />
                  </button>
                  <button className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5 text-blue-600" />
                  </button>
                  <button className="p-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </button>
                  <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WasteFeed;