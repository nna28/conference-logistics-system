import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import contractService from "../../services/contractService";
import BackButton from "../../components/layout/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const STATUS_FLOW = {
  Draft: { next: "Sent", label: "📤 Send to Partner", color: "var(--primary-color)" },
  Sent: { next: "Approved", label: "✅ Approve", color: "#22c55e", altNext: "Rejected", altLabel: "❌ Reject" },
  Approved: null,
  Rejected: { next: "Draft", label: "↩️ Reset to Draft", color: "var(--text-muted)" },
};

export default function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const userRole = localStorage.getItem("role") || "";

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const result = await contractService.getOverview(id);
      setData(result);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Change contract status to "${newStatus}"?`)) return;
    try {
      setStatusLoading(true);
      await contractService.updateStatus(id, newStatus);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    } finally {
      setStatusLoading(false);
    }
  };

  if (!data) return <LoadingSpinner />;

  const { contract, workshop, venue } = data;
  const statusActions = STATUS_FLOW[contract.status];

  return (
    <>
      <BackButton />

      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div className="page-header-left">
          <p className="page-subtitle">Contract Overview</p>
          <h1>Contract #{contract.id}</h1>
        </div>
        <div className="page-header-actions" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {/* Status action buttons */}
          {["Admin", "Sales Manager", "Logistics Coordinator", "Booking Staff"].includes(userRole) && statusActions && (
            <>
              <button
                className="btn btn-primary"
                style={{ background: statusActions.color, borderColor: statusActions.color }}
                onClick={() => handleStatusChange(statusActions.next)}
                disabled={statusLoading}
              >
                {statusLoading ? "Processing..." : statusActions.label}
              </button>
              {statusActions.altNext && (
                <button
                  className="btn btn-outline"
                  style={{ borderColor: "#ef4444", color: "#ef4444" }}
                  onClick={() => handleStatusChange(statusActions.altNext)}
                  disabled={statusLoading}
                >
                  {statusActions.altLabel}
                </button>
              )}
            </>
          )}
          <button
            className="btn btn-outline"
            onClick={() => navigate(`/contracts/edit/${id}`)}
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      {/* Status timeline */}
      <div className="table-card" style={{ padding: "16px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)", marginRight: "8px" }}>Status Flow:</span>
          {["Draft", "Sent", "Approved"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                className={`badge badge-${s.toLowerCase()}`}
                style={{
                  opacity: contract.status === s ? 1 : 0.35,
                  fontWeight: contract.status === s ? 700 : 400,
                  transform: contract.status === s ? "scale(1.1)" : "none",
                }}
              >
                {s}
              </span>
              {i < 2 && <span style={{ color: "var(--text-muted)" }}>→</span>}
            </div>
          ))}
          {contract.status === "Rejected" && (
            <>
              <span style={{ color: "var(--text-muted)" }}>|</span>
              <span className="badge badge-rejected" style={{ fontWeight: 700 }}>Rejected</span>
            </>
          )}
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Contract Info</h3>
          <div className="detail-field">
            <span className="detail-field-label">Contract ID</span>
            <span className="detail-field-value">#{contract.id}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Status</span>
            <span className="detail-field-value">
              <span className={`badge badge-${(contract.status || "draft").toLowerCase()}`}>
                {contract.status}
              </span>
            </span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Meeting Rooms</span>
            <span className="detail-field-value">{contract.meeting_rooms ?? "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Seating Style</span>
            <span className="detail-field-value">{contract.seating_style || "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">AV Requirements</span>
            <span className="detail-field-value">{contract.av_requirements || "—"}</span>
          </div>
          {contract.revision_notes && (
            <div className="detail-field">
              <span className="detail-field-label">Revision Notes</span>
              <span className="detail-field-value">{contract.revision_notes}</span>
            </div>
          )}
          <div className="detail-field">
            <span className="detail-field-label">Created At</span>
            <span className="detail-field-value">
              {contract.created_at ? new Date(contract.created_at).toLocaleString() : "—"}
            </span>
          </div>
          {contract.approved_at && (
            <div className="detail-field">
              <span className="detail-field-label">Approved At</span>
              <span className="detail-field-value">{new Date(contract.approved_at).toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="detail-card">
          <h3>Workshop & Venue</h3>
          <div className="detail-field">
            <span className="detail-field-label">Workshop</span>
            <span className="detail-field-value">{workshop?.workshop_code || `#${contract.workshop_id}`}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Workshop Type</span>
            <span className="detail-field-value">{workshop?.workshop_type || "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Date</span>
            <span className="detail-field-value">
              {workshop?.scheduled_time ? new Date(workshop.scheduled_time).toLocaleString() : "—"}
            </span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">City</span>
            <span className="detail-field-value">{workshop?.city || "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Expected Attendees</span>
            <span className="detail-field-value">{workshop?.expected_attendees ?? "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Venue</span>
            <span className="detail-field-value">{venue?.name || `#${contract.venue_id}`}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Venue Address</span>
            <span className="detail-field-value">{venue?.address || "—"}</span>
          </div>
          {venue && (
            <div className="detail-field">
              <span className="detail-field-label">Venue Capacity</span>
              <span className="detail-field-value">{venue.capacity ?? "—"} seats</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}