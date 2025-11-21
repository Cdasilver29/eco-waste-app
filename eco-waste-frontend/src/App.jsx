import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Removed fetchUser import because it's no longer exported
// import { fetchUser } from './store/slices/authSlice';

// Layout
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/Dashboard';
import LogWaste from './pages/LogWaste';
import ScanItem from './pages/ScanItem';
import Leaderboard from './pages/Leaderboard';
import StatsPage from './pages/StatsPage';
import MapView from './pages/MapView';
import ScheduleView from './pages/ScheduleView';
import TrackCollection from './pages/TrackCollection';
import WasteFeed from './pages/WasteFeed';
import ManufacturerOrders from './pages/ManufacturerOrders';
import TokensView from './pages/TokensView';
import RewardsView from './pages/RewardsView';
import AnalyticsView from './pages/AnalyticsView';

import Loading from './components/common/Loading';

// Chat & AI
import ChatWidget from './components/chat/ChatWidget';
import AIAssistantWidget from './components/ai/AIAssistantWidget';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" replace />;
  if (!user) return <Loading message="Loading your profile..." />;

  return children;
};

// OLD Layout Component (kept for compatibility)
const OldDashboardLayout = ({ children, showAI, setShowAI }) => {
  const { sidebarOpen } = useSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} p-6 mt-16`}>
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  const [showAI, setShowAI] = useState(false);

  // Removed fetchUser dispatch call
  // User is already loaded in authSlice on login or from localStorage

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Unified Dashboard */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardPage showAI={showAI} setShowAI={setShowAI} />
              </ProtectedRoute>
            }
          />

          {/* Individual Protected Routes */}
          <Route
            path="/log-waste"
            element={
              <ProtectedRoute>
                <OldDashboardLayout showAI={showAI} setShowAI={setShowAI}>
                  <LogWaste />
                </OldDashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/scan"
            element={
              <ProtectedRoute>
                <OldDashboardLayout showAI={showAI} setShowAI={setShowAI}>
                  <ScanItem />
                </OldDashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <OldDashboardLayout showAI={showAI} setShowAI={setShowAI}>
                  <Leaderboard />
                </OldDashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <OldDashboardLayout showAI={showAI} setShowAI={setShowAI}>
                  <StatsPage />
                </OldDashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <OldDashboardLayout showAI={showAI} setShowAI={setShowAI}>
                  <MapView />
                </OldDashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <OldDashboardLayout showAI={showAI} setShowAI={setShowAI}>
                  <ScheduleView />
                </OldDashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/track"
            element={
              <ProtectedRoute>
                <OldDashboardLayout showAI={showAI} setShowAI={setShowAI}>
                  <TrackCollection />
                </OldDashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/waste-feed"
            element={
              <ProtectedRoute>
                <OldDashboardLayout showAI={showAI} setShowAI={setShowAI}>
                  <WasteFeed />
                </OldDashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manufacturer-orders"
            element={
              <ProtectedRoute>
                <OldDashboardLayout showAI={showAI} setShowAI={setShowAI}>
                  <ManufacturerOrders />
                </OldDashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tokens"
            element={
              <ProtectedRoute>
                <OldDashboardLayout showAI={showAI} setShowAI={setShowAI}>
                  <TokensView />
                </OldDashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/rewards"
            element={
              <ProtectedRoute>
                <OldDashboardLayout showAI={showAI} setShowAI={setShowAI}>
                  <RewardsView />
                </OldDashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <OldDashboardLayout showAI={showAI} setShowAI={setShowAI}>
                  <AnalyticsView />
                </OldDashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect old dashboard */}
          <Route path="/old-dashboard" element={<Navigate to="/dashboard" replace />} />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      {/* Global Widgets */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <ChatWidget />
      {showAI && <AIAssistantWidget onClose={() => setShowAI(false)} />}
    </>
  );
}

export default App;




