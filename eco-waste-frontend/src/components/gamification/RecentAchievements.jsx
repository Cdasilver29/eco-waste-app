/ src/components/gamification/RecentAchievements.jsx
export const RecentAchievements = ({ achievements = [] }) => {
  const recentAchievements = achievements.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Achievements</h3>
      
      {recentAchievements.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>No achievements yet.</p>
          <p className="text-sm mt-1">Start logging waste to earn badges!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl hover:shadow-md transition-all"
            >
              <div className="text-4xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800">{achievement.name}</h4>
                <p className="text-sm text-slate-600">{achievement.description}</p>
              </div>
              <div className="text-right">
                <div className="text-emerald-600 font-semibold">+{achievement.points}</div>
                <div className="text-xs text-slate-500">{achievement.date}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
