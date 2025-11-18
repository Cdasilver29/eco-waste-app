import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUser } from './store/slices/authSlice';

// Layout
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LogWaste from './pages/LogWaste';
import ScanItem from './pages/ScanItem';
import Leaderboard from './pages/Leaderboard';
import StatsPage from './pages/StatsPage';
import MapPage from './pages/MapPage';
import SchedulePage from './pages/SchedulePage';
import Loading from './components/common/Loading';


// Chat
import ChatWidget from './components/chat/ChatWidget';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);
  
  if (!token) return <Navigate to="/login" replace />;
  if (!user) return <Loading message="Loading your profile..." />;
  
  return children;
};

// Layout Component
const DashboardLayout = ({ children }) => {
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

  useEffect(() => {
    if (token && !user) dispatch(fetchUser());
  }, [token, user, dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/log-waste"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <LogWaste />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/scan"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ScanItem />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Leaderboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StatsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MapPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SchedulePage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <ChatWidget /> {/* Globally available chat widget */}
    </>
  );
}

export default App;

