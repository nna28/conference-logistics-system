import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import travelScheduleService from "../../services/travelScheduleService";
import PageHeader from "../../components/layout/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";

export default function TravelScheduleList() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  
  const userRole = localStorage.getItem("role") || "";
  const canEdit = userRole !== "Training Consultant" && userRole !== "Consultant";

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const data = await travelScheduleService.getAll();
      setSchedules(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await travelScheduleService.delete(deleteId);
      setDeleteId(null);
      loadSchedules();
    } catch (error) {
      alert(error.message);
    }
  };

  const filtered = schedules.filter((s) =>
    (s.transport_type + s.status + String(s.workshop_id))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader
        title="Travel Schedules"
        subtitle="Manage travel schedules"
        onCreate={canEdit ? () => navigate("/travel-schedules/new") : undefined}
        createLabel="New Schedule"
        showSearch
        searchValue={search}
        onSearch={setSearch}
      />

      {userRole === "Admin" ? (
        <div className="admin-travel-list">
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              No travel schedules found
            </div>
          ) : (
            filtered.map((schedule) => (
              <div key={schedule.id} className="admin-travel-card">
                <div className="travel-header">
                  <div className="travel-transport">
                    {schedule.transport_type === "Flight" ? "✈️" : schedule.transport_type === "Train" ? "🚆" : "🚌"} {schedule.transport_type}
                  </div>
                  <span className={`badge badge-${(schedule.status || "pending").toLowerCase()}`}>
                    {schedule.status}
                  </span>
                </div>
                <div className="travel-body">
                  <p><strong>Workshop:</strong> #{schedule.workshop_id}</p>
                  <p><strong>Consultant:</strong> #{schedule.consultant_id}</p>
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "16px", borderTop: "1px dashed #e7f5ff", paddingTop: "12px" }}>
                  <button className="btn btn-outline btn-sm" onClick={() => navigate(`/travel-schedules/${schedule.id}`)}>View Details</button>
                  {canEdit && (
                    <>
                      <button className="btn btn-primary btn-sm" onClick={() => navigate(`/travel-schedules/edit/${schedule.id}`)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(schedule.id)}>Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Workshop</th>
                <th>Consultant</th>
                <th>Transport</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                    No travel schedules found
                  </td>
                </tr>
              ) : (
                filtered.map((schedule) => (
                  <tr key={schedule.id}>
                    <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>#{schedule.id}</td>
                    <td style={{ fontWeight: 600 }}>Workshop #{schedule.workshop_id}</td>
                    <td style={{ color: "var(--text-secondary)" }}>Consultant #{schedule.consultant_id}</td>
                    <td>{schedule.transport_type}</td>
                    <td>
                      <span className={`badge badge-${(schedule.status || "pending").toLowerCase()}`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <a
                          href="#"
                          title="View"
                          onClick={(e) => { e.preventDefault(); navigate(`/travel-schedules/${schedule.id}`); }}
                        >👁</a>
                        {canEdit && (
                          <>
                            <a
                              href="#"
                              title="Edit"
                              onClick={(e) => { e.preventDefault(); navigate(`/travel-schedules/edit/${schedule.id}`); }}
                            >✏️</a>
                            <button className="delete" onClick={() => setDeleteId(schedule.id)} title="Delete">🗑</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDeleteModal
        open={!!deleteId}
        title="Delete Travel Schedule"
        message="Are you sure you want to delete this travel schedule? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}