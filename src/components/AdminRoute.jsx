import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { Navigate } from 'react-router-dom';
import AccessDenied from '../pages/AccessDenied';

export default function AdminRoute({ children, secretPath }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || import.meta.env.REACT_APP_ADMIN_EMAIL || '';

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to={secretPath} replace />;
  if (user.email !== adminEmail) return <AccessDenied />;
  return children;
}
