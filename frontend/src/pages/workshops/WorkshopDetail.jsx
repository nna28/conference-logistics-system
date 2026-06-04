import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import workshopService from "../../services/workshopService";
import BackButton from "../../components/layout/BackButton";

function WorkshopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const userRole = localStorage.getItem("role") || "";

  const handleNotifyLogistics = async () => {
    if (!window.confirm("Send workshop details to Logistics Coordinators?")) return;
    setNotifyLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:8000/workshops/${id}/notify-logistics`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to notify");
      alert("Logistics Coordinators notified successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to notify Logistics Coordinators.");
    } finally {
      setNotifyLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      const res = await workshopService.getOverview(id);
      setData(res);
    };
    load();
  }, [id]);

  if (!data) return null;

  const { workshop, consultant, contracts, venues, travel_schedules, material_requests, shipments } = data;

  return (
    <>
      <BackButton />

      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div className="page-header-left">
          <p className="page-subtitle">Workshop Overview</p>
          <h1>{workshop.workshop_code}</h1>
        </div>
        <div className="page-header-actions" style={{ display: "flex", gap: "12px" }}>
          {["Admin", "Booking Staff"].includes(userRole) && (
            <button
              className="btn btn-outline"
              onClick={handleNotifyLogistics}
              disabled={notifyLoading}
            >
              {notifyLoading ? "Sending..." : "📢 Notify Logistics"}
            </button>
          )}
          {["Admin", "Booking Staff", "Logistics Coordinator"].includes(userRole) && (
            <button
              className="btn btn-outline"
              onClick={() => navigate(`/workshops/edit/${id}`)}
            >
              ✏️ Edit
            </button>
          )}
        </div>
      </div>

      <div className="detail-grid">

        <div className="detail-card">
          <h3>Workshop Info</h3>
          <div className="detail-field">
            <span className="detail-field-label">Code</span>
            <span className="detail-field-value">{workshop.workshop_code}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Type</span>
            <span className="detail-field-value">{workshop.workshop_type}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Scheduled Time</span>
            <span className="detail-field-value">
              {workshop.scheduled_time
                ? new Date(workshop.scheduled_time).toLocaleString()
                : "—"}
            </span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Expected Attendees</span>
            <span className="detail-field-value">{workshop.expected_attendees}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Status</span>
            <span className="detail-field-value">
              <span className={`badge badge-${(workshop.status || "pending").toLowerCase()}`}>
                {workshop.status}
              </span>
            </span>
          </div>
        </div>

        <div className="detail-card">
          <h3>Consultant</h3>
          {consultant ? (
            <>
              <div className="detail-field">
                <span className="detail-field-label">Name</span>
                <span className="detail-field-value">{consultant.full_name}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Username</span>
                <span className="detail-field-value">{consultant.username}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Email</span>
                <span className="detail-field-value">{consultant.email}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Role</span>
                <span className="detail-field-value">{consultant.role}</span>
              </div>
            </>
          ) : (
            <p style={{ color: "var(--text-muted)" }}>No consultant assigned</p>
          )}
        </div>

      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat-card">
          <div className="stat-card-icon blue">📄</div>
          <div className="stat-card-info">
            <div className="stat-card-label">Contracts</div>
            <div className="stat-card-value">{contracts?.length ?? 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange">🏛️</div>
          <div className="stat-card-info">
            <div className="stat-card-label">Venues</div>
            <div className="stat-card-value">{venues?.length ?? 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon purple">✈️</div>
          <div className="stat-card-info">
            <div className="stat-card-label">Travel Schedules</div>
            <div className="stat-card-value">{travel_schedules?.length ?? 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green">📋</div>
          <div className="stat-card-info">
            <div className="stat-card-label">Material Requests</div>
            <div className="stat-card-value">{material_requests?.length ?? 0}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WorkshopDetail;