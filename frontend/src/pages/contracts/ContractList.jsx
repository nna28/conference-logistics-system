import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import contractService from "../../services/contractService";
import PageHeader from "../../components/layout/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";

export default function ContractList() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const userRole = localStorage.getItem("role") || "";

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const data = await contractService.getAll();
      setContracts(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await contractService.delete(deleteId);
      setDeleteId(null);
      loadContracts();
    } catch (error) {
      alert(error.message);
    }
  };

  const filtered = contracts.filter((c) =>
    String(c.id).includes(search) ||
    String(c.workshop_id).includes(search) ||
    String(c.venue_id).includes(search) ||
    (c.status || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader
        title="Contracts"
        subtitle="Manage workshop contracts"
        onCreate={() => navigate("/contracts/new")}
        createLabel="New Contract"
        showSearch
        searchValue={search}
        onSearch={setSearch}
      />

      {userRole === "Admin" ? (
        <div className="admin-contracts-list">
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              No contracts found
            </div>
          ) : (
            filtered.map((contract) => (
              <div key={contract.id} className="admin-contract-card">
                <div className="contract-main">
                  <div className="contract-icon">📄</div>
                  <div className="contract-details">
                    <h4>Contract #{contract.id}</h4>
                    <p>Workshop #{contract.workshop_id} • Venue #{contract.venue_id}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <span className="badge" style={{ background: "rgba(255, 212, 59, 0.2)", color: "#ffd43b" }}>
                    {contract.status || "PENDING"}
                  </span>
                  <div className="contract-actions" style={{ display: "flex", gap: "8px" }}>
                    <button className="btn btn-icon btn-sm" onClick={() => navigate(`/contracts/${contract.id}`)} title="View">👁</button>
                    <button className="btn btn-icon btn-sm" onClick={() => navigate(`/contracts/edit/${contract.id}`)} title="Edit">✏️</button>
                    <button className="btn btn-icon btn-sm" style={{ color: "#fa5252", borderColor: "rgba(250,82,82,0.3)" }} onClick={() => setDeleteId(contract.id)} title="Delete">🗑</button>
                  </div>
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
                <th>Venue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                    No contracts found
                  </td>
                </tr>
              ) : (
                filtered.map((contract) => (
                  <tr key={contract.id}>
                    <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>#{contract.id}</td>
                    <td style={{ fontWeight: 600 }}>Workshop #{contract.workshop_id}</td>
                    <td>Venue #{contract.venue_id}</td>
                    <td>
                      <span className={`badge badge-${(contract.status || "pending").toLowerCase()}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <a
                          href="#"
                          title="View"
                          onClick={(e) => { e.preventDefault(); navigate(`/contracts/${contract.id}`); }}
                        >👁</a>
                        <a
                          href="#"
                          title="Edit"
                          onClick={(e) => { e.preventDefault(); navigate(`/contracts/edit/${contract.id}`); }}
                        >✏️</a>
                        <button className="delete" onClick={() => setDeleteId(contract.id)} title="Delete">🗑</button>
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
        title="Delete Contract"
        message="Are you sure you want to delete this contract? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}