import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import venueService from "../../services/venueService";
import PageHeader from "../../components/layout/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";

export default function VenueList() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const data = await venueService.getAll();
      setVenues(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await venueService.delete(deleteId);
      setDeleteId(null);
      loadVenues();
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  const filtered = venues.filter((v) =>
    (v.name + v.address + v.contact_phone)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader
        title="Venues"
        subtitle="Manage venue information"
        onCreate={() => navigate("/venues/new")}
        createLabel="New Venue"
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
              <th>Address</th>
              <th>Phone</th>
              <th>Sales Manager ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No venues found
                </td>
              </tr>
            ) : (
              filtered.map((venue) => (
                <tr key={venue.id}>
                  <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>#{venue.id}</td>
                  <td style={{ fontWeight: 600 }}>{venue.name}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{venue.address}</td>
                  <td>{venue.contact_phone}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{venue.sales_manager_id}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/venues/${venue.id}`} title="View">👁</Link>
                      <Link to={`/venues/edit/${venue.id}`} title="Edit">✏️</Link>
                      <button className="delete" onClick={() => setDeleteId(venue.id)} title="Delete">🗑</button>
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
        title="Delete Venue"
        message="Are you sure you want to delete this venue? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}