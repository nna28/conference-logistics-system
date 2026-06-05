import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import materialShipmentService from "../../services/materialShipmentService";
import PageHeader from "../../components/layout/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";

export default function MaterialShipmentList() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      const data = await materialShipmentService.getAll();
      setShipments(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await materialShipmentService.delete(deleteId);
      setDeleteId(null);
      loadShipments();
    } catch (error) {
      alert(error.message);
    }
  };

  const filtered = shipments.filter((s) =>
    (String(s.id) + String(s.material_request_id) + (s.packaging_status || "") + (s.shipping_status || ""))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader
        title="Material Shipments"
        subtitle="Manage material shipments"
        onCreate={() => navigate("/material-shipments/new")}
        createLabel="New Shipment"
        showSearch
        searchValue={search}
        onSearch={setSearch}
      />

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Request #</th>
              <th>Material #</th>
              <th>Quantity</th>
              <th>Packaging</th>
              <th>Shipping</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No shipments found
                </td>
              </tr>
            ) : (
              filtered.map((shipment) => (
                <tr key={shipment.id}>
                  <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>#{shipment.id}</td>
                  <td style={{ fontWeight: 600 }}>#{shipment.material_request_id}</td>
                  <td>#{shipment.material_id}</td>
                  <td>{shipment.quantity}</td>
                  <td>
                    <span className={`badge badge-${(shipment.packaging_status || "pending").toLowerCase()}`}>
                      {shipment.packaging_status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${(shipment.shipping_status || "pending").toLowerCase()}`}>
                      {shipment.shipping_status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <a
                        href="#"
                        title="View"
                        onClick={(e) => { e.preventDefault(); navigate(`/material-shipments/${shipment.id}`); }}
                      >👁</a>
                      <a
                        href="#"
                        title="Edit"
                        onClick={(e) => { e.preventDefault(); navigate(`/material-shipments/edit/${shipment.id}`); }}
                      >✏️</a>
                      <button className="delete" onClick={() => setDeleteId(shipment.id)} title="Delete">🗑</button>
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
        title="Delete Shipment"
        message="Are you sure you want to delete this shipment? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}