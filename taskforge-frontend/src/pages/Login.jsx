import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ import useNavigate and Link
import "./Login.css";
import * as api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Login({onLoginSuccess}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // ✅ initialize navigate
    const handleLogin = async (e) => {
    e.preventDefault();

    if (password.length < 5) {
      setError("Password must be at least 5 characters");
      return;
    }

    try {
      const res = await api.login(email, password);

     
      api.setAuthToken(res.token || res.data?.token);
      
      onLoginSuccess(res.token ? res : res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  

  return (
    <>
      <Header />
      <div className="login-wrapper">
        <div className="login-card">
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (Atleast 5 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            <button type="submit">Login</button>
          </form>

          <div className="links">
            <Link to="/forgot-password" className="flink">Forgot Password?</Link>
            <p className="login-link">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}