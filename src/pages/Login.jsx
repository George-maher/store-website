// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
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
        navigate("/admin");
      } else {
        await signOut(auth);
        setError("Access denied: not an admin");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed: " + (err?.message || ""));
    }
  };

  return (
    <div className="container center" style={{ minHeight: "70vh" }}>
      <form onSubmit={handleLogin} className="form-card" style={{ maxWidth: 480, width: "100%" }}>
        <h2 className="heading" style={{ marginBottom: 12 }}>
          Admin Login
        </h2>
        {error && (
          <p className="muted" style={{ color: "crimson", marginBottom: 12 }}>
            {error}
          </p>
        )}
        <input type="email" placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn-primary" style={{ width: "100%" }}>
          Login
        </button>
      </form>
    </div>
  );
}