import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import materialService from "../../services/materialService";
import BackButton from "../../components/layout/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function MaterialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);

  useEffect(() => {
    loadMaterial();
  }, [id]);

  const loadMaterial = async () => {
    try {
      const data = await materialService.getById(id);
      setMaterial(data);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!material) return <LoadingSpinner />;

  return (
    <>
      <BackButton />

      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div className="page-header-left">
          <p className="page-subtitle">Material Detail</p>
          <h1>{material.material_name}</h1>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate(`/materials/edit/${id}`)}
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      <div className="detail-card">
        <h3>Material Info</h3>
        <div className="detail-field">
          <span className="detail-field-label">ID</span>
          <span className="detail-field-value">#{material.id}</span>
        </div>
        <div className="detail-field">
          <span className="detail-field-label">Name</span>
          <span className="detail-field-value">{material.material_name}</span>
        </div>
        <div className="detail-field">
          <span className="detail-field-label">Type</span>
          <span className="detail-field-value">
            <span className="badge badge-draft">{material.material_type}</span>
          </span>
        </div>
      </div>
    </>
  );
}