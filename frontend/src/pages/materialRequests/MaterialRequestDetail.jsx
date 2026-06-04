import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import materialRequestService from "../../services/materialRequestService";
import BackButton from "../../components/layout/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function MaterialRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const result = await materialRequestService.getOverview(id);
      setData(result);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!data) return <LoadingSpinner />;

  const { material_request, workshop } = data;

  return (
    <>
      <BackButton />

      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div className="page-header-left">
          <p className="page-subtitle">Material Request Overview</p>
          <h1>Request #{id}</h1>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate(`/material-requests/edit/${id}`)}
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Request Info</h3>
          <div className="detail-field">
            <span className="detail-field-label">Request ID</span>
            <span className="detail-field-value">#{material_request.id}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Request Date</span>
            <span className="detail-field-value">
              {material_request.request_date
                ? new Date(material_request.request_date).toLocaleString()
                : "—"}
            </span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Delivery Address</span>
            <span className="detail-field-value">{material_request.delivery_address || "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Registered Attendees</span>
            <span className="detail-field-value">{material_request.registered_attendees}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Status</span>
            <span className="detail-field-value">
              <span className={`badge badge-${(material_request.status || "pending").toLowerCase()}`}>
                {material_request.status}
              </span>
            </span>
          </div>
        </div>

        <div className="detail-card">
          <h3>Workshop</h3>
          {workshop ? (
            <>
              <div className="detail-field">
                <span className="detail-field-label">Workshop Code</span>
                <span className="detail-field-value">{workshop.workshop_code}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Workshop Type</span>
                <span className="detail-field-value">{workshop.workshop_type}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Workshop Status</span>
                <span className="detail-field-value">
                  <span className={`badge badge-${(workshop.status || "pending").toLowerCase()}`}>
                    {workshop.status}
                  </span>
                </span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Expected Attendees</span>
                <span className="detail-field-value">{workshop.expected_attendees}</span>
              </div>
            </>
          ) : (
            <p style={{ color: "var(--text-muted)" }}>No workshop linked</p>
          )}
        </div>
      </div>
    </>
  );
}