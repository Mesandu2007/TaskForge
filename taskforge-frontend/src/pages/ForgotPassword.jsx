// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import "./ForgotPassword.css";
import * as api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.forgotPassword(email);
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response?.data || "Error sending email");
    }
  };

  return (
    <>
      <Header />

      <div className="forgot-wrapper">
        <div className="forgot-card">
          <h2>Forgot Password</h2>

          {message && <p className="message">{message}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit">Send Reset Link</button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}