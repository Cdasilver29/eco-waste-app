// src/components/gamification/ChallengesCard.jsx
export const ChallengesCard = () => {
  const challenges = [
    {
      id: 1,
      title: 'Weekly Warrior',
      description: 'Log waste 7 days in a row',
      progress: 5,
      target: 7,
      reward: 100,
      expiry: '3 days left',
      icon: '🎯'
    },
    {
      id: 2,
      title: 'Recycling Master',
      description: 'Recycle 50kg this month',
      progress: 32,
      target: 50,
      reward: 200,
      expiry: '15 days left',
      icon: '♻️'
    },
    {
      id: 3,
      title: 'Community Hero',
      description: 'Reach top 50 in leaderboard',
      progress: 68,
      target: 50,
      reward: 150,
      expiry: 'Ongoing',
      icon: '🏆'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Active Challenges</h3>
      
      <div className="space-y-4">
        {challenges.map((challenge) => {
          const percentage = (challenge.progress / challenge.target) * 100;
          const isComplete = percentage >= 100;
          
          return (
            <motion.div
              key={challenge.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                isComplete
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                  : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">{challenge.icon}</span>
                  <div>
                    <h4 className="font-semibold text-slate-800">{challenge.title}</h4>
                    <p className="text-sm text-slate-600">{challenge.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-emerald-600">
                    +{challenge.reward} pts
                  </div>
                  <div className="text-xs text-slate-500">{challenge.expiry}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Progress</span>
                  <span className="font-semibold text-slate-800">
                    {challenge.progress} / {challenge.target}
                  </span>
                </div>
                
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    className={`h-full rounded-full ${
                      isComplete
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                    }`}
                  />
                </div>
              </div>

              {isComplete && (
                <button className="w-full mt-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  Claim Reward
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};