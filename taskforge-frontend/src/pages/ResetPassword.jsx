import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./reset.css";
import * as api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password.length < 5) {
      return setError("Password must be at least 5 characters");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await api.resetPassword(token, password);
      setMessage("Password reset successful!");
      setError("");

      // redirect to login after 2 sec
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data || "Reset failed");
      setMessage("");
    }
  };

  return (
    <>
      <Header />

      <div className="reset-wrapper">
        <div className="reset-card">
          <h2>Reset Password</h2>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <form onSubmit={handleReset}>
            {/* New Password */}
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="password-field">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? "Hide" : "Show"}
              </span>
            </div>

            <button type="submit">Reset Password</button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}