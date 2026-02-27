import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import Lesson from './pages/Lesson';
import Assistant from './pages/Assistant';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

// New Pages
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Setup2FA from './pages/Setup2FA';
import Verify2FA from './pages/Verify2FA';
import Analytics from './pages/Analytics';
import Certificates from './pages/Certificates';
import CertificateView from './pages/CertificateView';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './contexts/AuthContext';

const GlobalWfdButton = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;
  if (location.pathname === '/assistant' || location.pathname.startsWith('/admin')) return null;

  return (
    <Link
      to="/assistant"
      className="fixed bottom-6 right-6 z-[100] flex items-center justify-center w-14 h-14 bg-brand-primary rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:bg-cyan-400 hover:scale-110 transition-all text-brand-dark font-display font-bold text-lg drop-shadow-2xl hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
      title="Chat with WFD"
    >
      WFD
    </Link>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <SettingsProvider>
            <ProgressProvider>
              <ToastProvider>
                <div className="min-h-screen bg-brand-dark text-brand-text selection:bg-brand-primary selection:text-brand-dark flex flex-col relative">
                  <Header />
                  <GlobalWfdButton />

                  <main className="flex-1">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/courses" element={<Courses />} />
                      <Route
                        path="/lesson/:courseId"
                        element={
                          <ProtectedRoute>
                            <Lesson />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />

                      {/* Auth Routes - Redirect if already logged in */}
                      <Route
                        path="/login"
                        element={
                          <ProtectedRoute requireAuth={false}>
                            <Login />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/signup"
                        element={
                          <ProtectedRoute requireAuth={false}>
                            <Signup />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/verify-2fa" element={<Verify2FA />} />

                      {/* Protected Routes - Require authentication */}
                      <Route path="/assistant" element={<Assistant />} />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/verify-email"
                        element={
                          <ProtectedRoute>
                            <VerifyEmail />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/setup-2fa"
                        element={
                          <ProtectedRoute>
                            <Setup2FA />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/analytics"
                        element={
                          <ProtectedRoute>
                            <Analytics />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/certificates"
                        element={
                          <ProtectedRoute>
                            <Certificates />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/certificate/:certificateId" element={<CertificateView />} />
                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        }
                      />

                      {/* Admin Route - Hidden and Protected */}
                      <Route
                        path="/admin"
                        element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        }
                      />

                      {/* 404 Catch-all */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>

                  <Footer />
                </div>
              </ToastProvider>
            </ProgressProvider>
          </SettingsProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
