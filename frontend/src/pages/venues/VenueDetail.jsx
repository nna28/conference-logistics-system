import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import venueService from "../../services/venueService";
import BackButton from "../../components/layout/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    try {
      const result = await venueService.getOverview(id);
      setData(result);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!data) return <LoadingSpinner />;

  const { venue, sales_manager } = data;

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
            <span className="detail-field-label">Contact Phone</span>
            <span className="detail-field-value">{venue.contact_phone || "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Description</span>
            <span className="detail-field-value">{venue.description || "—"}</span>
          </div>
        </div>

        <div className="detail-card">
          <h3>Sales Manager</h3>
          {sales_manager ? (
            <>
              <div className="detail-field">
                <span className="detail-field-label">Full Name</span>
                <span className="detail-field-value">{sales_manager.full_name}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Username</span>
                <span className="detail-field-value">{sales_manager.username}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Email</span>
                <span className="detail-field-value">{sales_manager.email}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Role</span>
                <span className="detail-field-value">{sales_manager.role}</span>
              </div>
            </>
          ) : (
            <p style={{ color: "var(--text-muted)" }}>No sales manager assigned</p>
          )}
        </div>
      </div>
    </>
  );
}