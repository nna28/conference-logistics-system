import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import travelScheduleService from "../../services/travelScheduleService";
import BackButton from "../../components/layout/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function TravelScheduleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const result = await travelScheduleService.getOverview(id);
      setData(result);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!data) return <LoadingSpinner />;

  const { travel_schedule, workshop, consultant } = data;

  return (
    <>
      <BackButton />

      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div className="page-header-left">
          <p className="page-subtitle">Travel Schedule Overview</p>
          <h1>Schedule #{id}</h1>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate(`/travel-schedules/edit/${id}`)}
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Schedule Info</h3>
          <div className="detail-field">
            <span className="detail-field-label">Transport Type</span>
            <span className="detail-field-value">{travel_schedule.transport_type}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Departure Location</span>
            <span className="detail-field-value">{travel_schedule.departure_location || "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Destination</span>
            <span className="detail-field-value">{travel_schedule.destination || "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Departure Time</span>
            <span className="detail-field-value">
              {travel_schedule.departure_time
                ? new Date(travel_schedule.departure_time).toLocaleString()
                : "—"}
            </span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Status</span>
            <span className="detail-field-value">
              <span className={`badge badge-${(travel_schedule.status || "pending").toLowerCase()}`}>
                {travel_schedule.status}
              </span>
            </span>
          </div>
          {travel_schedule.travel_info && (
            <div className="detail-field">
              <span className="detail-field-label">Travel Info</span>
              <span className="detail-field-value">{travel_schedule.travel_info}</span>
            </div>
          )}
        </div>

        <div className="detail-card">
          <h3>Workshop & Consultant</h3>
          <div className="detail-field">
            <span className="detail-field-label">Workshop</span>
            <span className="detail-field-value">{workshop?.workshop_code || `#${travel_schedule.workshop_id}`}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Workshop Type</span>
            <span className="detail-field-value">{workshop?.workshop_type || "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Consultant</span>
            <span className="detail-field-value">{consultant?.full_name || `#${travel_schedule.consultant_id}`}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Consultant Email</span>
            <span className="detail-field-value">{consultant?.email || "—"}</span>
          </div>
        </div>
      </div>
    </>
  );
}