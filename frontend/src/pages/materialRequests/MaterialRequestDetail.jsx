import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import materialRequestService from "../../services/materialRequestService";
import BackButton from "../../components/layout/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function MaterialRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const userRole = localStorage.getItem("role") || "";

  // ✅ Đã sửa hàm handleNotify để sử dụng Service
  const handleNotify = async () => {
    if (!window.confirm("Gửi thông báo hoàn tất cho Logistics Coordinator?")) return;
    setNotifyLoading(true);
    try {
      // Dùng service đã được cấu hình sẵn token thay vì dùng fetch trực tiếp
      await materialRequestService.notifyCompletion(id);
      
      alert("Đã gửi thông báo hoàn tất thành công!");
      loadData(); // Cập nhật lại giao diện ngay sau khi thông báo thành công
    } catch (err) {
      console.error(err);
      // Hiển thị lỗi từ backend nếu có (ví dụ: bị từ chối quyền, không tìm thấy request...)
      alert("Lỗi khi gửi thông báo: " + (err.response?.data?.detail || err.message));
    } finally {
      setNotifyLoading(false);
    }
  };

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
        <div className="page-header-actions" style={{ display: "flex", gap: "12px" }}>
          {["Admin", "Materials Handling Staff"].includes(userRole) && (
            <button
              className="btn btn-outline"
              onClick={handleNotify}
              disabled={notifyLoading}
            >
              {notifyLoading ? "Đang gửi..." : "✅ Gửi thông báo hoàn tất"}
            </button>
          )}
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
              {material_request.created_at
                ? new Date(material_request.created_at).toLocaleString()
                : "—"}
            </span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Delivery Address</span>
            <span className="detail-field-value">{material_request.delivery_address || "—"}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Quantity Needed</span>
            <span className="detail-field-value">{material_request.quantity_needed}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Packaging Status</span>
            <span className="detail-field-value">
              <span className={`badge badge-${(material_request.packaging_status || "pending").toLowerCase()}`}>
                {material_request.packaging_status || "Pending"}
              </span>
            </span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Shipping Status</span>
            <span className="detail-field-value">
              <span className={`badge badge-${(material_request.shipping_status || "pending").toLowerCase()}`}>
                {material_request.shipping_status || "Pending"}
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