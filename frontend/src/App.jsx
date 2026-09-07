import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { MarketProvider } from './context/MarketContext';
import { PaperTradingProvider } from './context/PaperTradingContext';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MarketTicker } from './components/layout/MarketTicker';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { AcademyPage } from './pages/AcademyPage';
import { LessonPage } from './pages/LessonPage';
import { MarketsPage } from './pages/MarketsPage';
import { PaperTradingPage } from './pages/PaperTradingPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { JournalPage } from './pages/JournalPage';
import { ToolsPage } from './pages/ToolsPage';
import { KKNAIPage } from './pages/KKNAIPage';
import { BacktestPage } from './pages/BacktestPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <MarketProvider>
          <PaperTradingProvider>
            <div className="flex flex-col min-h-screen bg-kkn-bg text-kkn-text-primary">
              <MarketTicker />
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Core Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/learn" element={<AcademyPage />} />
                  <Route path="/learn/:courseSlug" element={<AcademyPage />} />
                  <Route path="/learn/:courseSlug/:lessonSlug" element={<LessonPage />} />
                  <Route path="/markets" element={<MarketsPage />} />
                  <Route path="/trade" element={<PaperTradingPage />} />
                  <Route path="/papertrading" element={<PaperTradingPage />} />
                  <Route path="/tools" element={<ToolsPage />} />
                  <Route path="/ai" element={<KKNAIPage />} />
                  <Route path="/roadmap" element={<RoadmapPage />} />
                  <Route path="/backtest" element={<BacktestPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/disclaimer" element={<DisclaimerPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />

                  {/* Authenticated Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/portfolio"
                    element={
                      <ProtectedRoute>
                        <PortfolioPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/journal"
                    element={
                      <ProtectedRoute>
                        <JournalPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Protected Route */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </PaperTradingProvider>
        </MarketProvider>
      </AuthProvider>
    </ToastProvider>
  );
};
