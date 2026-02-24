import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import OTPVerification from "./OTPVerification";
import "./Auth.css";

const LoginModal = ({
  onClose,
  onSwitchToRegister,
  onSwitchToForgotPassword,
}) => {
  const { login, sendVerificationCode, verifyCode } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First, send verification code
      await sendVerificationCode(email);
      setShowOTP(true);
    } catch (err) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      // First verify the OTP
      await verifyCode({ email, code: otp });

      // If OTP is verified, proceed with login
      await login({ email, password });
      onClose();
    } catch (err) {
      throw new Error(err.message || "Failed to verify code");
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendVerificationCode(email);
    } catch (err) {
      setError(err.message || "Failed to resend verification code");
    }
  };

  if (showOTP) {
    return (
      <OTPVerification
        email={email}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        onBack={() => setShowOTP(false)}
      />
    );
  }

  return (
    <div className="modal-content">
      <button className="modal-close" onClick={onClose}>
        &times;
      </button>
      <h2>Login</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading || !email || !password}
        >
          {loading ? "Sending Code..." : "Continue"}
        </button>

        <div className="switch-auth">
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            disabled={loading}
          >
            Forgot Password?
          </button>
        </div>

        <div className="switch-auth">
          <span>Don't have an account? </span>
          <button type="button" onClick={onSwitchToRegister} disabled={loading}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginModal;
