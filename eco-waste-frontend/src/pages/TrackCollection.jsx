import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Video, Clock } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { wasteAPI } from '../services/api';
import { useSelector } from 'react-redux'; 

const TrackCollection = () => {
  const [trackingActive, setTrackingActive] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Track Collection</h1>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
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
                <button className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm flex items-center justify-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
                <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center justify-center space-x-1">
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
      </div>
    </div>
  );
};

export default TrackCollection;