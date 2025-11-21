//src/components/gamification/ImpactWidget.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Recycle, Leaf } from 'lucide-react';
export const ImpactWidget = ({ impact = {} }) => {
  const metrics = [
    {
      label: 'CO₂ Reduced',
      value: impact.co2 || 0,
      unit: 'kg',
      icon: '🌍',
      color: 'from-blue-400 to-cyan-600'
    },
    {
      label: 'Trees Saved',
      value: impact.trees || 0,
      unit: '',
      icon: '🌲',
      color: 'from-green-400 to-emerald-600'
    },
    {
      label: 'Water Saved',
      value: impact.water || 0,
      unit: 'L',
      icon: '💧',
      color: 'from-blue-400 to-indigo-600'
    },
    {
      label: 'Energy Saved',
      value: impact.energy || 0,
      unit: 'kWh',
      icon: '⚡',
      color: 'from-yellow-400 to-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Your Impact</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 bg-gradient-to-br ${metric.color} rounded-xl text-white`}
          >
            <div className="text-3xl mb-2">{metric.icon}</div>
            <div className="text-2xl font-bold mb-1">
              {metric.value.toLocaleString()}{metric.unit}
            </div>
            <div className="text-sm opacity-90">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
        <p className="text-sm text-center text-emerald-800">
          <strong>Amazing!</strong> Your actions have made a real difference to our planet 🌍
        </p>
      </div>
    </div>
  );
};
