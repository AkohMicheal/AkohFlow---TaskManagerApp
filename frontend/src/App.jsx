import React, { useState, useEffect } from 'react';
import { authService } from './services/api';
import { adManager } from './services/ads';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import FeedbackModal from './components/FeedbackModal';

export default function App() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Initialize ads engine (AdMob on mobile, AdSense on web)
    adManager.initialize();

    // Listen to logout events triggered by 401 interceptor
    const handleLogout = () => {
      setUser(null);
    };
    window.addEventListener('auth_logout', handleLogout);

    // Verify authentication with backend if token exists
    if (authService.isAuthenticated()) {
      authService
        .getMe()
        .then((res) => setUser(res.user))
        .catch(() => {
          setUser(null);
        });
    }

    return () => {
      window.removeEventListener('auth_logout', handleLogout);
    };
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleRewardUnlocked = () => {
    showToast('🎉 Extra pet treats unlocked! Thank you for supporting FocusPaws.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-slate-700 animate-in slide-in-from-top duration-200">
          {toastMessage}
        </div>
      )}

      {/* Header Navigation */}
      <Navbar
        user={user}
        onUpdateUser={(updated) => setUser(updated)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onRewardUnlock={handleRewardUnlocked}
      />

      {/* Main Content */}
      <main className="flex-1">
        {user ? (
          <Dashboard user={user} />
        ) : authView === 'login' ? (
          <Login
            onAuthSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setAuthView('register')}
          />
        ) : (
          <Register
            onAuthSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}
      </main>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}
