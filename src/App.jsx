import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastProvider } from './components/ToastProvider';
import { CartProvider } from './components/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CartPage from './pages/CartPage';
import ProductDetail from './pages/ProductDetail';
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
    return () => unsubscribe();
  }, []);

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || import.meta.env.REACT_APP_ADMIN_EMAIL || 'tony@degoy.com';
  const SECRET = '/super-secret-login-8392jfks';

  // Sync dark class on <html> and persist setting
  useEffect(() => {
    try {
      localStorage.setItem('dark', darkMode ? 'true' : 'false');
    } catch {
      // Unable to persist theme
    }
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <div className={`${darkMode ? 'dark' : ''} ${!lang || lang === 'ar' ? 'rtl' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
        style={{ 
          backgroundImage: "url('/images/WhatsApp Image 2026-02-24 at 1.00.52 PM.jpeg')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        }}>
        <BrowserRouter>
          <ToastProvider>
            <CartProvider>
              <Navbar darkMode={darkMode} setDarkMode={setDarkMode} lang={lang} setLang={setLang} />
              <Routes>
                <Route path="/" element={<Home lang={lang} />} />
                <Route path="/product/:id" element={<ProductDetail lang={lang} />} />
                <Route path="/cart" element={<CartPage lang={lang} />} />
                <Route
                  path={SECRET}
                  element={
                    loading ? (
                      <div className="p-10">Loading...</div>
                    ) : user && user.email === adminEmail ? (
                      <Navigate to="/br49_Tony_Degoy45" />
                    ) : (
                      <Login lang={lang} />
                    )
                  }
                />
                <Route
                  path="/br49_Tony_Degoy45"
                  element={
                    <AdminRoute secretPath={SECRET} lang={lang}>
                      <Dashboard lang={lang} />
                    </AdminRoute>
                  }
                />
              </Routes>
              <Footer lang={lang} />
            </CartProvider>
          </ToastProvider>
        </BrowserRouter>
      </div>
    </div>

  );
}