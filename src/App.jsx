import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminRoute from './components/AdminRoute';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('dark') === 'true';
    } catch {
      return false;
    }
  });
  const [lang, setLang] = useState('en');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || import.meta.env.REACT_APP_ADMIN_EMAIL || 'admin@example.com';
        const SECRET = '/super-secret-login-8392jfks';

  // Sync dark class on <html> and persist setting
  useEffect(() => {
    try {
      localStorage.setItem('dark', darkMode ? 'true' : 'false');
    } catch (e) {
      console.debug('Unable to persist theme', e);
    }
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
          <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <BrowserRouter>
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} lang={lang} setLang={setLang} />
          <Routes>
            <Route path="/" element={<Home lang={lang} />} />
            <Route
              path={SECRET}
              element={
                loading ? (
                  <div className="p-10">Loading...</div>
                ) : user && user.email === adminEmail ? (
                  <Navigate to="/admin" />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/br49_Tony_Degoy45"
              element={
                <AdminRoute secretPath={SECRET}>
                  <Dashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}