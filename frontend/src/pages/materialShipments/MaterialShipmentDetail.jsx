import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import materialShipmentService from "../../services/materialShipmentService";
import BackButton from "../../components/layout/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function MaterialShipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const result = await materialShipmentService.getOverview(id);
      setData(result);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!data) return <LoadingSpinner />;

  const { shipment, material_request, material } = data;

  return (
    <>
      <BackButton />

      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div className="page-header-left">
          <p className="page-subtitle">Shipment Overview</p>
          <h1>Shipment #{id}</h1>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate(`/material-shipments/edit/${id}`)}
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Shipment Info</h3>
          <div className="detail-field">
            <span className="detail-field-label">Shipment ID</span>
            <span className="detail-field-value">#{shipment.id}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Quantity</span>
            <span className="detail-field-value">{shipment.quantity}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Packaging Status</span>
            <span className="detail-field-value">
              <span className={`badge badge-${(shipment.packaging_status || "pending").toLowerCase()}`}>
                {shipment.packaging_status}
              </span>
            </span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Shipping Status</span>
            <span className="detail-field-value">
              <span className={`badge badge-${(shipment.shipping_status || "pending").toLowerCase()}`}>
                {shipment.shipping_status}
              </span>
            </span>
          </div>
        </div>

        <div className="detail-card">
          <h3>Material & Request</h3>
          <div className="detail-field">
            <span className="detail-field-label">Material</span>
            <span className="detail-field-value">{material?.material_name || `#${shipment.material_id}`}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Material Type</span>
            <span className="detail-field-value">{material?.material_type || "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Request ID</span>
            <span className="detail-field-value">#{material_request?.id || shipment.material_request_id}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Request Status</span>
            <span className="detail-field-value">
              {material_request?.status ? (
                <span className={`badge badge-${material_request.status.toLowerCase()}`}>
                  {material_request.status}
                </span>
              ) : "—"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}