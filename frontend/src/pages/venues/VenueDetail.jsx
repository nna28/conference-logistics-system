import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import venueService from "../../services/venueService";
import workshopService from "../../services/workshopService";
import BackButton from "../../components/layout/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState("");
  const userRole = localStorage.getItem("role") || "";

  useEffect(() => {
    loadDetail();
    loadWorkshops();
  }, [id]);

  const loadDetail = async () => {
    try {
      const result = await venueService.getOverview(id);
      setData(result);
    } catch (err) {
      alert(err.message);
    }
  };

  const loadWorkshops = async () => {
    try {
      const result = await workshopService.getAll();
      setWorkshops(result);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return <LoadingSpinner />;

  const { venue } = data;

  // Auto-suggest rooms calculation
  const selectedWorkshop = workshops.find((w) => w.id === parseInt(selectedWorkshopId));
  const suggestedRooms = selectedWorkshop && venue.capacity
    ? Math.ceil(selectedWorkshop.expected_attendees / venue.capacity)
    : null;

  return (
    <>
      <BackButton />

      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div className="page-header-left">
          <p className="page-subtitle">Venue Overview</p>
          <h1>{venue.name}</h1>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate(`/venues/edit/${id}`)}
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Venue Info</h3>
          <div className="detail-field">
            <span className="detail-field-label">Name</span>
            <span className="detail-field-value">{venue.name}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Address</span>
            <span className="detail-field-value">{venue.address}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Room Type</span>
            <span className="detail-field-value">{venue.room_type || "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Capacity</span>
            <span className="detail-field-value">{venue.capacity ?? "—"} seats</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Rental Cost</span>
            <span className="detail-field-value">{venue.rental_cost || "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Equipment</span>
            <span className="detail-field-value">{venue.equipment_supported || "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Availability</span>
            <span className="detail-field-value">
              <span className={`badge ${venue.is_available ? "badge-confirmed" : "badge-cancelled"}`}>
                {venue.is_available ? "Available" : "Unavailable"}
              </span>
            </span>
          </div>
        </div>

        {/* Auto-suggest rooms panel */}
        <div className="detail-card">
          <h3>🧮 Room Suggestion Calculator</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
            Select a Workshop to auto-calculate how many rooms are needed based on attendees and venue capacity.
          </p>
          <div className="form-group">
            <label>Select Workshop</label>
            <select
              value={selectedWorkshopId}
              onChange={(e) => setSelectedWorkshopId(e.target.value)}
            >
              <option value="">— Select a workshop —</option>
              {workshops.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.workshop_code} — {w.workshop_type} ({w.expected_attendees} attendees)
                </option>
              ))}
            </select>
          </div>

          {selectedWorkshop && (
            <div style={{
              marginTop: "16px",
              padding: "16px",
              background: "var(--bg-card-hover)",
              borderRadius: "10px",
              border: "1px solid var(--border-color)"
            }}>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>
                Expected Attendees: <strong style={{ color: "var(--text-primary)" }}>{selectedWorkshop.expected_attendees}</strong>
                {" "}÷ Venue Capacity: <strong style={{ color: "var(--text-primary)" }}>{venue.capacity}</strong>
              </div>
              {suggestedRooms !== null ? (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    fontSize: "36px",
                    fontWeight: 800,
                    color: "var(--primary-color)",
                    lineHeight: 1
                  }}>
                    {suggestedRooms}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "14px" }}>Suggested Rooms</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Based on full capacity usage
                    </div>
                  </div>
                </div>
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                  Cannot calculate — venue capacity not set.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}