// src/components/gamification/LevelProgress.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award } from 'lucide-react';
import { LEVELS } from '../../utils/constants';

export const LevelProgress = ({ currentPoints = 0 }) => {
  const getCurrentLevel = () => {
    return LEVELS.find(level => 
      currentPoints >= level.minPoints && currentPoints <= level.maxPoints
    ) || LEVELS[0];
  };

  const getNextLevel = () => {
    const currentLevel = getCurrentLevel();
    return LEVELS.find(level => level.level === currentLevel.level + 1);
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  
  const pointsInLevel = currentPoints - currentLevel.minPoints;
  const pointsNeeded = nextLevel ? nextLevel.minPoints - currentLevel.minPoints : 0;
  const progress = nextLevel ? (pointsInLevel / pointsNeeded) * 100 : 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              Level {currentLevel.level}
            </h3>
            <p className="text-slate-600">{currentLevel.title}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-purple-600">
            {currentPoints.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600">Total Points</div>
        </div>
      </div>

      {nextLevel && (
        <>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Progress to Level {nextLevel.level}</span>
              <span className="font-semibold text-slate-800">
                {pointsInLevel.toLocaleString()} / {pointsNeeded.toLocaleString()}
              </span>
            </div>
            
            <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full relative"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ["0%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">
                Next: {nextLevel.title}
              </span>
            </div>
            <span className="text-sm text-purple-700 font-semibold">
              {(pointsNeeded - pointsInLevel).toLocaleString()} points to go
            </span>
          </div>
        </>
      )}

      {!nextLevel && (
        <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 text-center">
          <p className="text-amber-900 font-semibold">
            🎉 Maximum Level Achieved! You're an Eco Champion!
          </p>
        </div>
      )}
    </div>
  );
};
