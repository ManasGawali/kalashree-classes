import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import MonthSelector from "../components/MonthSelector.jsx";

export default function Payment() {
  const [dashboard, setDashboard] = useState(null);
  const [selectedCount, setSelectedCount] = useState(1);
  const [quote, setQuote] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [step, setStep] = useState(1); // 1 = select months, 2 = pay via QR, 3 = success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/user/dashboard").then((res) => setDashboard(res.data)).catch(() => {});
  }, []);

  const selectedMonths = dashboard ? dashboard.payableMonths.slice(0, selectedCount) : [];

  const handleGetQr = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/payments/quote", {
        months: selectedMonths.map((m) => ({ month: m.month, year: m.year })),
      });
      setQuote(res.data);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Could not calculate amount");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (transactionId.trim().length < 4) {
      setError("Please enter a valid transaction / UTR ID");
      return;
    }
    setLoading(true);
    try {
      await api.post("/payments/submit", {
        months: selectedMonths.map((m) => ({ month: m.month, year: m.year })),
        transactionId,
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Payment submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (!dashboard) return <div className="container" style={{ padding: 24 }}>Loading…</div>;

  return (
    <div className="container" style={{ padding: "24px 16px 48px", maxWidth: 560 }}>
      <h1 className="section-title">Pay Monthly Fees</h1>
      <p className="section-sub">{dashboard.user.batch.name} • Rs. {dashboard.user.batch.monthlyFee}/month</p>

      {error && <div className="alert alert-error">{error}</div>}

      {step === 1 && (
        <div className="card">
          <h3 style={{ fontSize: 15, marginTop: 0 }}>Select month(s) to pay</h3>
          <p className="text-muted" style={{ fontSize: 13 }}>
            Starts from your due month ({dashboard.dueDate}). Tap to select single or multiple consecutive months.
          </p>
          <MonthSelector
            months={dashboard.payableMonths}
            selectedCount={selectedCount}
            onChange={setSelectedCount}
          />
          <div className="flex-between mt-24">
            <div>
              <div className="text-muted" style={{ fontSize: 12.5 }}>Total Amount</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--brown)" }}>
                Rs. {selectedCount * dashboard.user.batch.monthlyFee}
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleGetQr} disabled={loading}>
              {loading ? <span className="spinner" /> : "Continue to Pay"}
            </button>
          </div>
        </div>
      )}

      {step === 2 && quote && (
        <div className="card text-center">
          <h3 style={{ fontSize: 15, marginTop: 0 }}>Scan &amp; Pay via UPI</h3>
          <p className="text-muted" style={{ fontSize: 13 }}>
            {quote.months.length} month(s) selected — amount is pre-filled in your UPI app.
          </p>
          <img
            src={quote.qrDataUrl}
            alt="UPI QR Code"
            style={{ width: 220, height: 220, margin: "12px auto", borderRadius: 12, border: "1px solid var(--border)" }}
          />
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--brown)", marginBottom: 18 }}>
            Rs. {quote.amount}
          </div>

          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            <div className="form-group">
              <label className="form-label">UPI Transaction ID / UTR Number</label>
              <input
                className="form-input"
                placeholder="e.g. 425617389210"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? <span className="spinner" /> : "Confirm Payment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="card text-center">
          <div style={{ fontSize: 44, marginBottom: 8 }}>✅</div>
          <h3 style={{ marginTop: 0, color: "var(--wood-dark)" }}>Payment Recorded!</h3>
          <p className="text-muted" style={{ fontSize: 14 }}>
            {dashboard.user.email
              ? "A confirmation email has been sent to your registered email address."
              : "Your payment has been recorded. Add an email address (via the admin) to receive confirmations."}
          </p>
          <button className="btn btn-primary mt-24" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
