import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import StatCard from "../components/StatCard.jsx";

export default function UserDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    api
      .get("/user/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"));
  };

  useEffect(load, []);

  if (error) return <div className="container" style={{ padding: 24 }}><div className="alert alert-error">{error}</div></div>;
  if (!data) return <div className="container" style={{ padding: 24 }}>Loading…</div>;

  return (
    <div className="container" style={{ padding: "24px 16px 48px" }}>
      <div className="flex-between mb-16">
        <div>
          <h1 className="section-title">Hi, {data.user.name.split(" ")[0]} 👋</h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>{data.user.batch.name} Batch</p>
        </div>
        <span className={`badge ${data.isUpToDate ? "badge-success" : "badge-danger"}`}>
          {data.isUpToDate ? "Fees Up To Date" : `${data.monthsOverdue} Month(s) Due`}
        </span>
      </div>

      <div className="grid-3 mt-24">
        <StatCard label="Paid Till" value={data.paidTill} />
        <StatCard label="Next Due" value={data.dueDate} accent={data.isUpToDate ? undefined : "var(--danger)"} />
        <StatCard label="Monthly Fee" value={`Rs. ${data.user.batch.monthlyFee}`} />
      </div>

      <div className="card mt-24" style={{ background: "linear-gradient(135deg, var(--brown), var(--wood-dark))", color: "white" }}>
        <div className="flex-between">
          <div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>Ready to pay your fees?</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
              {data.isUpToDate ? "Pay in advance" : `${data.monthsOverdue} month(s) pending`}
            </div>
          </div>
          <Link to="/pay" className="btn" style={{ background: "white", color: "var(--brown)" }}>
            Pay Now
          </Link>
        </div>
      </div>

      <h2 className="section-title mt-24" style={{ fontSize: 18 }}>Recent Payments</h2>
      <div className="card table-wrap">
        {data.recentPayments.length === 0 ? (
          <p className="text-muted">No payments made yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Months</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentPayments.map((p) => (
                <tr key={p._id}>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>{p.months.length} month(s)</td>
                  <td>Rs. {p.amount}</td>
                  <td>{p.transactionId}</td>
                  <td>
                    <span className={`badge ${p.status === "completed" ? "badge-success" : p.status === "rejected" ? "badge-danger" : "badge-warning"}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
