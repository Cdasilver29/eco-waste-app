// src/components/gamification/PointsBreakdown.jsx
export const PointsBreakdown = ({ breakdown = {} }) => {
  const categories = [
    { key: 'recyclable', label: 'Recyclable', color: 'from-emerald-400 to-teal-600', icon: '♻️' },
    { key: 'organic', label: 'Organic', color: 'from-green-400 to-lime-600', icon: '🌱' },
    { key: 'general', label: 'General', color: 'from-slate-400 to-gray-600', icon: '🗑️' },
    { key: 'hazardous', label: 'Hazardous', color: 'from-red-400 to-rose-600', icon: '⚠️' }
  ];

  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Points Breakdown</h3>
      
      <div className="space-y-4">
        {categories.map((category) => {
          const points = breakdown[category.key] || 0;
          const percentage = total > 0 ? (points / total) * 100 : 0;
          
          return (
            <div key={category.key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium text-slate-700">{category.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">{points.toLocaleString()}</div>
                  <div className="text-sm text-slate-500">{percentage.toFixed(1)}%</div>
                </div>
              </div>
              
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-slate-800">Total Points</span>
          <span className="text-2xl font-bold text-emerald-600">
            {total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
