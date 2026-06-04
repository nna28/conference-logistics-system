import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import materialService from "../../services/materialService";
import PageHeader from "../../components/layout/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";

export default function MaterialList() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const data = await materialService.getAll();
      setMaterials(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await materialService.delete(deleteId);
      setDeleteId(null);
      loadMaterials();
    } catch (error) {
      alert(error.message);
    }
  };

  const filtered = materials.filter((m) =>
    (m.material_name + m.material_type)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader
        title="Materials"
        subtitle="Manage material catalog"
        onCreate={() => navigate("/materials/new")}
        createLabel="New Material"
        showSearch
        searchValue={search}
        onSearch={setSearch}
      />

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No materials found
                </td>
              </tr>
            ) : (
              filtered.map((material) => (
                <tr key={material.id}>
                  <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>#{material.id}</td>
                  <td style={{ fontWeight: 600 }}>{material.material_name}</td>
                  <td>
                    <span className="badge badge-draft">{material.material_type}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <a
                        href="#"
                        title="View"
                        onClick={(e) => { e.preventDefault(); navigate(`/materials/${material.id}`); }}
                      >👁</a>
                      <a
                        href="#"
                        title="Edit"
                        onClick={(e) => { e.preventDefault(); navigate(`/materials/edit/${material.id}`); }}
                      >✏️</a>
                      <button className="delete" onClick={() => setDeleteId(material.id)} title="Delete">🗑</button>
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
        title="Delete Material"
        message="Are you sure you want to delete this material? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}