import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import materialRequestService from "../../services/materialRequestService";
import PageHeader from "../../components/layout/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";

export default function MaterialRequestList() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await materialRequestService.getAll();
      setRequests(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await materialRequestService.delete(deleteId);
      setDeleteId(null);
      loadRequests();
    } catch (error) {
      alert(error.message);
    }
  };

  const filtered = requests.filter((r) =>
    (String(r.id) + String(r.workshop_id) + (r.status || "") + (r.delivery_address || ""))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader
        title="Material Requests"
        subtitle="Manage material requests"
        onCreate={() => navigate("/material-requests/new")}
        createLabel="New Request"
        showSearch
        searchValue={search}
        onSearch={setSearch}
      />

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Workshop</th>
              <th>Delivery Address</th>
              <th>Attendees</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No material requests found
                </td>
              </tr>
            ) : (
              filtered.map((request) => (
                <tr key={request.id}>
                  <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>#{request.id}</td>
                  <td style={{ fontWeight: 600 }}>Workshop #{request.workshop_id}</td>
                  <td style={{ color: "var(--text-secondary)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {request.delivery_address || "—"}
                  </td>
                  <td>{request.registered_attendees}</td>
                  <td>
                    <span className={`badge badge-${(request.status || "pending").toLowerCase()}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <a
                        href="#"
                        title="View"
                        onClick={(e) => { e.preventDefault(); navigate(`/material-requests/${request.id}`); }}
                      >👁</a>
                      <a
                        href="#"
                        title="Edit"
                        onClick={(e) => { e.preventDefault(); navigate(`/material-requests/edit/${request.id}`); }}
                      >✏️</a>
                      <button className="delete" onClick={() => setDeleteId(request.id)} title="Delete">🗑</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteModal
        open={!!deleteId}
        title="Delete Material Request"
        message="Are you sure you want to delete this material request? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}