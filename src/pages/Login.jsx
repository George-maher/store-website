// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from '../utils/translations';

export default function Login({ lang = 'en' }) {
  const isEn = lang === 'en';
  const t = useTranslation(lang);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "YOUREMAIL";
      if (user?.email === ADMIN_EMAIL) {
        navigate("/SECRET PATH");
      } else {
        await signOut(auth);
        setError(isEn ? "Access denied: not an admin" : "تم رفض الوصول: لست مشرفاً");
      }
    } catch (err) {
      console.error(err);
      setError(isEn ? "Login failed: " + (err?.message || "") : "فشل تسجيل الدخول: " + (err?.message || ""));
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 ${!isEn ? 'rtl' : ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {t.adminLogin}
        </h2>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              {t.email}
            </label>
            <input 
              type="email" 
              name="email"
              placeholder={t.email} 
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${!isEn ? 'text-right' : ''}`} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              {t.password}
            </label>
            <input 
              type="password" 
              name="password"
              placeholder={t.password} 
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${!isEn ? 'text-right' : ''}`} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            {t.login}
          </button>
        </form>
      </div>
    </div>
  );
}
