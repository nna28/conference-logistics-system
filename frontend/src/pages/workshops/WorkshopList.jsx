import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import workshopService from "../../services/workshopService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import PageHeader from "../../components/layout/PageHeader";

function WorkshopList() {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const loadData = async () => {
    try {
      const data = await workshopService.getAll();
      setWorkshops(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async () => {
    await workshopService.delete(deleteId);
    setDeleteId(null);
    loadData();
  };

  const filtered = workshops.filter((item) =>
    item.workshop_code?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader
        title="Workshops"
        subtitle="Manage and track your workshops"
        onCreate={() => navigate("/workshops/new")}
        createLabel="New Workshop"
        showSearch
        searchValue={search}
        onSearch={setSearch}
      />

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Workshop Code</th>
              <th>Type</th>
              <th>Attendees</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No workshops found
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>#{item.id}</td>
                  <td style={{ fontWeight: 600 }}>{item.workshop_code}</td>
                  <td>{item.workshop_type}</td>
                  <td>{item.expected_attendees}</td>
                  <td>
                    <span className={`badge badge-${(item.status || "pending").toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/workshops/${item.id}`} title="View">👁</Link>
                      <Link to={`/workshops/edit/${item.id}`} title="Edit">✏️</Link>
                      <button className="delete" onClick={() => setDeleteId(item.id)} title="Delete">🗑</button>
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
        title="Delete Workshop"
        message="Are you sure you want to delete this workshop? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}

export default WorkshopList;