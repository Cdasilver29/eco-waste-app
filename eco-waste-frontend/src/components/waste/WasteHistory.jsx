// src/components/waste/WasteHistory.jsx
export const WasteHistory = () => {
  const history = [
    {
      id: 1,
      type: 'recyclable',
      category: 'Plastic',
      weight: 2.5,
      points: 25,
      date: '2024-11-15',
      time: '10:30 AM',
      status: 'verified'
    },
    {
      id: 2,
      type: 'organic',
      category: 'Food Scraps',
      weight: 1.8,
      points: 18,
      date: '2024-11-14',
      time: '03:15 PM',
      status: 'verified'
    },
    {
      id: 3,
      type: 'general',
      category: 'Mixed Waste',
      weight: 3.2,
      points: 16,
      date: '2024-11-13',
      time: '09:45 AM',
      status: 'pending'
    }
  ];

  const typeColors = {
    recyclable: 'from-emerald-400 to-teal-600',
    organic: 'from-green-400 to-lime-600',
    general: 'from-slate-400 to-gray-600',
    hazardous: 'from-red-400 to-rose-600'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Waste History</h2>

      <div className="space-y-4">
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${typeColors[item.type]} rounded-xl flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{item.weight}kg</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{item.category}</div>
                  <div className="text-sm text-slate-600">{item.date} • {item.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-600">+{item.points}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.status === 'verified'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all">
        Load More
      </button>
    </div>
  );
};

export default { WasteLogger, WasteHistory };