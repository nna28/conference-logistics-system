import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import contractService from "../../services/contractService";
import BackButton from "../../components/layout/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";

// Dynamic status flow is implemented within the component

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
    // Để hiển thị đẹp hơn, bạn có thể in hoa chữ cái đầu khi Alert
    const displayStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    if (!window.confirm(`Change contract status to "${displayStatus}"?`)) return;
    
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

  const handleMarkCompleted = async () => {
    if (!window.confirm("Mark contract as completed and notify parties?")) return;
    try {
      setStatusLoading(true);
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:8000/contracts/${id}/notify-completion`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed");
      alert("Đã đánh dấu hoàn tất và gửi thông báo thành công!");
      await loadData();
    } catch(err) {
      alert("Error: " + err.message);
    } finally {
      setStatusLoading(false);
    }
  };

  if (!data) return <LoadingSpinner />;

  const { contract, workshop, venue } = data;
  
  // ✅ 2. Đảm bảo trạng thái hiện tại được so sánh đúng (chuyển về chữ thường nếu cần)
  const currentStatus = (contract.status || "PENDING").toUpperCase();

  // ✅ 3. Helper function để In hoa chữ cái đầu khi hiển thị UI
  const formatStatus = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  const renderStatusActions = () => {
    // Admin or Logistics Coordinator can approve or reject/request edit when PENDING
    if (["Admin", "Logistics Coordinator"].includes(userRole)) {
      if (currentStatus === "PENDING") {
        return (
          <>
            <button className="btn btn-primary" style={{ background: "#22c55e", borderColor: "#22c55e" }} onClick={() => handleStatusChange("APPROVED")} disabled={statusLoading}>
              ✅ Phê duyệt
            </button>
            <button className="btn btn-outline" style={{ borderColor: "#f59e0b", color: "#f59e0b" }} onClick={() => handleStatusChange("EDITING")} disabled={statusLoading}>
              ✏️ Yêu cầu chỉnh sửa
            </button>
            <button className="btn btn-outline" style={{ borderColor: "#ef4444", color: "#ef4444" }} onClick={() => handleStatusChange("REJECTED")} disabled={statusLoading}>
              ❌ Không phê duyệt
            </button>
          </>
        );
      }
      if (currentStatus === "APPROVED") {
        return (
          <button className="btn btn-primary" style={{ background: "var(--primary-color)", borderColor: "var(--primary-color)" }} onClick={handleMarkCompleted} disabled={statusLoading}>
            ✅ Xác nhận thành công
          </button>
        );
      }
    }

    // Admin or Sales Manager can submit again if it's in EDITING
    if (["Admin", "Sales Manager", "Booking Staff"].includes(userRole)) {
      if (currentStatus === "EDITING") {
        return (
          <button className="btn btn-primary" style={{ background: "var(--primary-color)", borderColor: "var(--primary-color)" }} onClick={() => handleStatusChange("PENDING")} disabled={statusLoading}>
            📤 Gửi lại phê duyệt
          </button>
        );
      }
    }

    return null;
  };

  return (
    <>
      <BackButton />

      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div className="page-header-left">
          <p className="page-subtitle">Contract Overview</p>
          <h1>Contract #{contract.id}</h1>
        </div>
        <div className="page-header-actions" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {renderStatusActions()}
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
          {/* ✅ 4. Map qua các key viết thường, nhưng dùng formatStatus để hiển thị */}
          {["PENDING", "EDITING", "APPROVED", "COMPLETED"].map((s, i, arr) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                className={`badge badge-${s.toLowerCase()}`}
                style={{
                  opacity: currentStatus === s ? 1 : 0.35,
                  fontWeight: currentStatus === s ? 700 : 400,
                  transform: currentStatus === s ? "scale(1.1)" : "none",
                }}
              >
                {formatStatus(s)}
              </span>
              {i < arr.length - 1 && <span style={{ color: "var(--text-muted)" }}>→</span>}
            </div>
          ))}
          {currentStatus === "REJECTED" && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "8px" }}>
              <span className="badge badge-rejected" style={{ opacity: 1, fontWeight: 700, transform: "scale(1.1)", color: "#ef4444", border: "1px solid #ef4444", padding: "4px 8px", borderRadius: "12px", fontSize: "12px" }}>
                Rejected
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Contract Info</h3>
          {/* ... Các trường khác giữ nguyên ... */}
          <div className="detail-field">
            <span className="detail-field-label">Status</span>
            <span className="detail-field-value">
              {/* ✅ 5. Hiển thị formatStatus */}
              <span className={`badge badge-${currentStatus.toLowerCase()}`}>
                {formatStatus(contract.status || "PENDING")}
              </span>
            </span>
          </div>
          {/* ... Các phần còn lại giữ nguyên ... */}
        </div>
        {/* ... */}
      </div>
    </>
  );
}