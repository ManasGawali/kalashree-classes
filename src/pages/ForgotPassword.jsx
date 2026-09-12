import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

const STEPS = { PHONE: 0, OTP: 1, RESET: 2, SUCCESS: 3 };

export default function ForgotPassword() {
  const [step, setStep] = useState(STEPS.PHONE);
  const [phone, setPhone] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [redirectCount, setRedirectCount] = useState(5);

  const navigate = useNavigate();
  const otpRefs = useRef([]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Auto-redirect after success
  useEffect(() => {
    if (step !== STEPS.SUCCESS) return;
    if (redirectCount <= 0) {
      navigate("/login");
      return;
    }
    const t = setTimeout(() => setRedirectCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, redirectCount, navigate]);

  /* ---------- Step 1: Request OTP ---------- */
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { phone: phone.trim() });
      setMaskedEmail(res.data.maskedEmail);
      setStep(STEPS.OTP);
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- OTP input handlers ---------- */
  const handleOtpChange = (idx, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[idx] = value.slice(-1);
    setOtp(next);
    if (value && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || "";
    setOtp(next);
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  /* ---------- Step 2: Verify OTP ---------- */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password/verify-otp", { phone: phone.trim(), otp: code });
      setResetToken(res.data.resetToken);
      setStep(STEPS.RESET);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Step 3: Reset Password ---------- */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password/reset", { resetToken, newPassword });
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Stepper indicator ---------- */
  const stepLabels = ["Phone", "OTP", "New Password"];
  const activeIdx = step === STEPS.SUCCESS ? 3 : step;

  return (
    <div className="auth-wrap">
      <div className="card auth-card" style={{ maxWidth: 440 }}>

        {/* Step indicator */}
        {step !== STEPS.SUCCESS && (
          <div className="fp-stepper">
            {stepLabels.map((label, i) => (
              <div key={i} className={`fp-step ${i < activeIdx ? "done" : ""} ${i === activeIdx ? "active" : ""}`}>
                <div className="fp-step-circle">
                  {i < activeIdx ? "✓" : i + 1}
                </div>
                <span className="fp-step-label">{label}</span>
                {i < stepLabels.length - 1 && <div className="fp-step-line" />}
              </div>
            ))}
          </div>
        )}

        {/* ---------- STEP 1: Phone ---------- */}
        {step === STEPS.PHONE && (
          <div className="fp-panel">
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-sub">
              Enter the phone number linked to your account. We'll send a verification code to your registered email.
            </p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleRequestOtp}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  id="fp-phone"
                  className="form-input"
                  type="tel"
                  inputMode="numeric"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <button id="fp-send-otp" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? <span className="spinner" /> : "Send OTP"}
              </button>
            </form>

            <p className="text-muted text-center" style={{ marginTop: 18, fontSize: 13.5 }}>
              <Link to="/login" className="fp-back-link">← Back to Login</Link>
            </p>
          </div>
        )}

        {/* ---------- STEP 2: OTP ---------- */}
        {step === STEPS.OTP && (
          <div className="fp-panel">
            <h1 className="auth-title">Verify OTP</h1>
            <p className="auth-sub">
              We sent a 6-digit code to <strong>{maskedEmail}</strong>. Enter it below.
            </p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleVerifyOtp}>
              <div className="otp-input-group" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`fp-otp-${i}`}
                    ref={(el) => (otpRefs.current[i] = el)}
                    className="otp-box"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <button id="fp-verify-otp" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: 18 }}>
                {loading ? <span className="spinner" /> : "Verify OTP"}
              </button>
            </form>

            <div className="fp-resend-row">
              {resendCooldown > 0 ? (
                <span className="text-muted">Resend OTP in {resendCooldown}s</span>
              ) : (
                <button className="fp-resend-btn" onClick={handleRequestOtp} disabled={loading}>
                  Resend OTP
                </button>
              )}
            </div>

            <p className="text-muted text-center" style={{ marginTop: 8, fontSize: 13.5 }}>
              <button className="fp-back-link" onClick={() => { setStep(STEPS.PHONE); setError(""); }} style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}>
                ← Change phone number
              </button>
            </p>
          </div>
        )}

        {/* ---------- STEP 3: New Password ---------- */}
        {step === STEPS.RESET && (
          <div className="fp-panel">
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-sub">Create a new password for your account. It must be at least 6 characters.</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="fp-password-wrap">
                  <input
                    id="fp-new-password"
                    className="form-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={6}
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    className="fp-eye-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  id="fp-confirm-password"
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button id="fp-reset-submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? <span className="spinner" /> : "Set New Password"}
              </button>
            </form>
          </div>
        )}

        {/* ---------- STEP 4: Success ---------- */}
        {step === STEPS.SUCCESS && (
          <div className="fp-panel fp-success-panel">
            <div className="fp-success-icon">✓</div>
            <h1 className="auth-title" style={{ textAlign: "center" }}>Password Reset!</h1>
            <p className="auth-sub" style={{ textAlign: "center" }}>
              Your password has been updated successfully. You can now log in with your new password.
            </p>
            <Link to="/login" id="fp-go-login" className="btn btn-primary btn-block">
              Go to Login ({redirectCount}s)
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
