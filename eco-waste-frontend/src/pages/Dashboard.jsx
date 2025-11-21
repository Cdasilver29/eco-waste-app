import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// Layout
import DashboardLayout from '../components/layout/DashboardLayout';

// Dashboard Overview Components
import CitizenDashboard from '../components/dashboard/CitizenDashboard';
import ManufacturerDashboard from '../components/dashboard/ManufacturerDashboard';

// Page components
import LogWaste from '../pages/LogWaste';
import TrackCollection from '../pages/TrackCollection';
import WasteFeed from '../pages/WasteFeed';
import ManufacturerOrders from '../pages/ManufacturerOrders';
import ScheduleView from '../pages/ScheduleView';
import MapView from '../pages/MapView';
import TokensView from '../pages/TokensView';
import RewardsView from '../pages/RewardsView';
import AnalyticsView from '../pages/AnalyticsView';

// Widgets
import ChatWidget from '../components/chat/ChatWidget';
import AIAssistantWidget from '../components/ai/AIAssistantWidget';

import { Leaf } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [showChat, setShowChat] = useState(false);
  const [showAI, setShowAI] = useState(false);

  // Redirect if no user
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Set active section based on current URL
  useEffect(() => {
    if (!user || !user.role) return;

    const path = location.pathname;
    if (path === '/dashboard') {
      setActiveSection('overview');
    } else {
      const section = path.split('/').pop();
      setActiveSection(section);
    }
  }, [location, user]);

  // Navigation handler
  const handleNavigation = (section) => {
    setActiveSection(section);

    if (section === 'overview') {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard/${section}`);
    }
  };

  // Loading UI
  if (loading || !user || !user.role) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const isCitizen = user.role === 'citizen';

  return (
    <>
      <DashboardLayout
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={handleNavigation}
        showChat={showChat}
        setShowChat={setShowChat}
        showAI={showAI}
        setShowAI={setShowAI}
      >
        <Routes>
          {/* Overview Route */}
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {isCitizen ? (
                  <CitizenDashboard user={user} activeSection={activeSection} />
                ) : (
                  <ManufacturerDashboard user={user} activeSection={activeSection} />
                )}
              </motion.div>
            }
          />

          {/* Citizen Routes */}
          {isCitizen && (
            <>
              <Route path="log-waste" element={<LogWaste />} />
              <Route path="track" element={<TrackCollection />} />
              <Route path="tokens" element={<TokensView user={user} />} />
              <Route path="rewards" element={<RewardsView />} />
            </>
          )}

          {/* Manufacturer Routes */}
          {!isCitizen && (
            <>
              <Route path="waste-feed" element={<WasteFeed />} />
              <Route path="orders" element={<ManufacturerOrders />} />
              <Route path="analytics" element={<AnalyticsView />} />
            </>
          )}

          {/* Shared Routes */}
          <Route path="schedule" element={<ScheduleView userRole={user.role} />} />
          <Route path="map" element={<MapView userRole={user.role} />} />
        </Routes>
      </DashboardLayout>

      {/* Chat Widget */}
      {showChat && (
        <ChatWidget
          onClose={() => setShowChat(false)}
          userRole={user.role}
        />
      )}

      {/* AI Assistant Widget */}
      {showAI && (
        <AIAssistantWidget
          onClose={() => setShowAI(false)}
        />
      )}
    </>
  );
};

export default DashboardPage;


