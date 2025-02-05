import React from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import BookingPage from './pages/BookingPage'
import TrackingPage from './pages/TrackingPage'
import InventoryPage from './pages/InventoryPage'
import ReportsPage from './pages/ReportsPage'
import { LoggingService, LogLevel } from './services/LoggingService'
import EventList from './components/events/EventList'
import EventForm from './components/events/EventForm'
import LogisticsOverview from './components/logistics/LogisticsOverview'
import Profile from './pages/user/Profile'
import SettingsForm from './components/settings/SettingsForm'
import { ThemeProvider } from './theme/ThemeContext'

// Configure logging for the application
const logger = LoggingService.getInstance()
logger.setLogLevel(import.meta.env.PROD ? LogLevel.ERROR : LogLevel.DEBUG)

function App() {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route
              path="/landing"
              element={<LandingPage />}
            />

            {/* Feature routes - authentication temporarily disabled */}
            <Route
              path="/dashboard"
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              }
            />
            <Route
              path="/booking"
              element={
                <MainLayout>
                  <BookingPage />
                </MainLayout>
              }
            />
            <Route
              path="/tracking"
              element={
                <MainLayout>
                  <TrackingPage />
                </MainLayout>
              }
            />
            <Route
              path="/inventory"
              element={
                <MainLayout>
                  <InventoryPage />
                </MainLayout>
              }
            />
            <Route
              path="/logistics"
              element={
                <MainLayout>
                  <LogisticsOverview />
                </MainLayout>
              }
            />
            <Route
              path="/reports"
              element={
                <MainLayout>
                  <ReportsPage />
                </MainLayout>
              }
            />
            <Route
              path="/events"
              element={
                <MainLayout>
                  <EventList />
                </MainLayout>
              }
            />
            <Route
              path="/events/new"
              element={
                <MainLayout>
                  <EventForm />
                </MainLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <MainLayout>
                  <Profile />
                </MainLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <MainLayout>
                  <SettingsForm />
                </MainLayout>
              }
            />

            {/* Root redirect */}
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            {/* Catch-all route */}
            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </GlobalErrorBoundary>
  )
}

export default App
