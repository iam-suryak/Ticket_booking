import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CustomerProfileModal } from './components/CustomerProfileModal';

// Pages
import { HomePage } from './pages/HomePage';
import { DestinationsPage } from './pages/DestinationsPage';
import { PackageDetailsPage } from './pages/PackageDetailsPage';
import { BookingPage } from './pages/BookingPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { LoginPage } from './pages/LoginPage';

// Scroll Restoration helper component
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search]);

  return null;
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BookingProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-sky-500 selection:text-white">
              <Navbar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/destinations" element={<DestinationsPage />} />
                  <Route path="/package/:id" element={<PackageDetailsPage />} />
                  <Route path="/book/:id" element={<BookingPage />} />
                  <Route path="/my-bookings" element={<MyBookingsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  {/* Fallback route */}
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </div>
              <Footer />
            </div>

            {/* Global Customer Auth & Profile Modals */}
            <AuthModal />
            <CustomerProfileModal />
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
