import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { wasteAPI } from '../services/api';
import { useSelector } from 'react-redux';

const Leaderboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [leaderboard, setLeaderboard] = useState([]);
  const [period, setPeriod] = useState('all_time');
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
    loadMyRank();
  }, [period]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await wasteAPI.getLeaderboard({
        municipalityId: user.municipality._id,
        period,
        limit: 50
      });
      setLeaderboard(response.data.data);
    } catch (error) {
      console.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const loadMyRank = async () => {
    try {
      const response = await wasteAPI.getMyRank();
      setMyRank(response.data.data);
    } catch (error) {
      console.error('Failed to load rank');
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />;
    return null;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Trophy className="w-10 h-10" />
          Leaderboard
        </h1>
        <p className="text-purple-100 text-lg">
          See how you rank against other eco-warriors!
        </p>
      </motion.div>

      {/* My Rank Card */}
      {myRank && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card gradient>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Your Current Rank</p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-green-600">
                    #{myRank.rank}
                  </span>
                  <div>
                    <p className="text-sm text-gray-600">
                      out of {myRank.totalUsers} users
                    </p>
                    <p className="text-xs text-green-600">
                      Top {myRank.percentile}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-sm mb-1">Total Points</p>
                <p className="text-3xl font-bold text-purple-600">
                  {myRank.points}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Period Filter */}
      <div className="flex gap-3 overflow-x-auto">
        {['all_time', 'monthly', 'weekly'].map((p) => (
          <Badge
            key={p}
            variant={period === p ? 'success' : 'default'}
            size="lg"
            className="cursor-pointer"
            onClick={() => setPeriod(p)}
          >
            {p.replace('_', ' ')}
          </Badge>
        ))}
      </div>

      {/* Leaderboard List */}
      <Card title="Top Performers" icon="🏆">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <div className="animate-spin w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full mx-auto mb-4" />
            <p>Loading leaderboard...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No data available yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  entry.userId === user._id
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md font-bold text-lg">
                  {getRankIcon(entry.rank) || getRankBadge(entry.rank)}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">
                      {entry.name}
                    </p>
                    {entry.userId === user._id && (
                      <Badge variant="info" size="sm">You</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-600">
                      Level {entry.level}
                    </span>
                    <span className="text-sm text-gray-600">
                      {entry.badges} badges
                    </span>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {entry.points.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Leaderboard;
