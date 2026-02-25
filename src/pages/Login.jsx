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
      const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "";
      if (user?.email === ADMIN_EMAIL) {
        navigate("/br49_Tony_Degoy45");
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
    <div className={`container center ${!isEn ? 'rtl' : ''}`} style={{ minHeight: "70vh" }}>
      <form onSubmit={handleLogin} className="form-card" style={{ maxWidth: 480, width: "100%" }}>
        <h2 className="heading" style={{ marginBottom: 12 }}>
          {t.adminLogin}
        </h2>
        {error && (
          <p className="muted" style={{ color: "crimson", marginBottom: 12 }}>
            {error}
          </p>
        )}
        <input 
          type="email" 
          placeholder={t.email} 
          className={`input ${!isEn ? 'text-right' : ''}`} 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder={t.password} 
          className={`input ${!isEn ? 'text-right' : ''}`} 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit" className="btn-primary" style={{ width: "100%" }}>
          {t.login}
        </button>
      </form>
    </div>
  );
}