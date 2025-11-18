// src/App.jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pages
import MapPage from './screens/MapPage';
import SchedulePage from './screens/SchedulePage';
import StatsPage from './screens/StatsPage';

// Optional wrapper for layout or auth
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Map"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Map">
          {() => (
            <ProtectedRoute>
              <DashboardLayout>
                <MapPage />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Schedule">
          {() => (
            <ProtectedRoute>
              <DashboardLayout>
                <SchedulePage />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Stats">
          {() => (
            <ProtectedRoute>
              <DashboardLayout>
                <StatsPage />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

