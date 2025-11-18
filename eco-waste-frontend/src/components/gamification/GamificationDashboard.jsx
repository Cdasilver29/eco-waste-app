// src/components/gamification/GamificationDashboard.jsx
export const GamificationDashboard = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <LevelProgress currentPoints={user?.points || 0} />
        <StreakCounter />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <BadgeShowcase />
        <ChallengesCard />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <PointsBreakdown breakdown={user?.pointsBreakdown || {}} />
        <ImpactWidget impact={user?.impact || {}} />
      </div>

      <LeaderboardCard />
    </div>
  );
};

export default {
  LevelProgress,
  RecentAchievements,
  PointsBreakdown,
  ChallengesCard,
  ImpactWidget,
  GamificationDashboard
};