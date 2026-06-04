import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import contractService from "../../services/contractService";
import BackButton from "../../components/layout/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

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

  if (!data) return <LoadingSpinner />;

  const { contract, workshop, venue } = data;

  return (
    <>
      <BackButton />

      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div className="page-header-left">
          <p className="page-subtitle">Contract Overview</p>
          <h1>Contract #{contract.id}</h1>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate(`/contracts/edit/${id}`)}
          >
            ✏️ Edit
          </button>
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
              <span className={`badge badge-${(contract.status || "pending").toLowerCase()}`}>
                {contract.status}
              </span>
            </span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Contract Info</span>
            <span className="detail-field-value">{contract.contract_info || "—"}</span>
          </div>
        </div>

        <div className="detail-card">
          <h3>Related Info</h3>
          <div className="detail-field">
            <span className="detail-field-label">Workshop</span>
            <span className="detail-field-value">{workshop?.workshop_code || `#${contract.workshop_id}`}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Workshop Type</span>
            <span className="detail-field-value">{workshop?.workshop_type || "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Venue</span>
            <span className="detail-field-value">{venue?.name || `#${contract.venue_id}`}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Venue Address</span>
            <span className="detail-field-value">{venue?.address || "—"}</span>
          </div>
        </div>
      </div>
    </>
  );
}