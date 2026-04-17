import React, { useState, useEffect } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import * as api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Register({ onLoginSuccess }) { 
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name) return setError("Name is required");
    if (password.length < 5) return setError("Password must be at least 5 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");

    try {
      await api.register(email, password, name);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleGoogleLogin = () => {
    // Redirect user to backend Google OAuth route
    window.location.href = "http://localhost:3000/auth/google"; // adjust port if needed
  };

  // 🔹 Check for token from Google redirect after registering
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token && onLoginSuccess) {
      localStorage.setItem("token", token);
      onLoginSuccess(token); // update App.jsx state
      navigate("/dashboard", { replace: true });
    }
  }, [onLoginSuccess, navigate]);

  return (
    <>
      <Header />
      <div className="register-wrapper">
        <div className="register-card">
          <h2>Register</h2>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <div className="password-field">
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 5 chars)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="password-field">
              <span onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? "Hide" : "Show"}
              </span>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit">Register</button>
          </form>

          <div className="divider">OR</div>

          <button className="google-btn" onClick={handleGoogleLogin}>
            Continue with Google
          </button>

          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}