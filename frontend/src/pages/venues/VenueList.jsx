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

  // Advanced filter state
  const [filters, setFilters] = useState({
    city: "",
    room_type: "",
    max_cost: "",
    min_capacity: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async (activeFilters = filters) => {
    try {
      setLoading(true);
      const cleaned = Object.fromEntries(
        Object.entries(activeFilters).filter(([, v]) => v !== "")
      );
      const data = await venueService.getAll(cleaned);
      setVenues(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    loadVenues(filters);
  };

  const handleClearFilters = () => {
    const cleared = { city: "", room_type: "", max_cost: "", min_capacity: "" };
    setFilters(cleared);
    loadVenues(cleared);
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
    (v.name + v.address).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader
        title="Venues"
        subtitle="Search and manage venue information"
        onCreate={() => navigate("/venues/new")}
        createLabel="New Venue"
        showSearch
        searchValue={search}
        onSearch={setSearch}
      />

      {/* Advanced Filter Panel */}
      <div className="table-card" style={{ marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            cursor: "pointer",
          }}
          onClick={() => setShowFilters(!showFilters)}
        >
          <span style={{ fontWeight: 600, fontSize: "14px" }}>
            🔍 Advanced Filters
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            {showFilters ? "▲ Hide" : "▼ Show"}
          </span>
        </div>

        {showFilters && (
          <form onSubmit={handleFilterSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
                padding: "0 20px 16px",
              }}
            >
              <div className="form-group">
                <label>City / Address</label>
                <input
                  name="city"
                  placeholder="e.g. Hanoi"
                  value={filters.city}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="form-group">
                <label>Room Type</label>
                <input
                  name="room_type"
                  placeholder="e.g. Conference"
                  value={filters.room_type}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="form-group">
                <label>Max Cost (VND)</label>
                <input
                  type="number"
                  name="max_cost"
                  placeholder="e.g. 5000000"
                  value={filters.max_cost}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="form-group">
                <label>Min Capacity (seats)</label>
                <input
                  type="number"
                  name="min_capacity"
                  placeholder="e.g. 50"
                  value={filters.min_capacity}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", padding: "0 20px 16px" }}>
              <button type="submit" className="btn btn-primary" style={{ fontSize: "13px", padding: "8px 20px" }}>
                Apply Filters
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ fontSize: "13px", padding: "8px 20px" }}
                onClick={handleClearFilters}
              >
                Clear
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Room Type</th>
              <th>Capacity</th>
              <th>Rental Cost</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No venues found
                </td>
              </tr>
            ) : (
              filtered.map((venue) => (
                <tr key={venue.id}>
                  <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>#{venue.id}</td>
                  <td style={{ fontWeight: 600 }}>{venue.name}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{venue.address}</td>
                  <td>{venue.room_type || "—"}</td>
                  <td>{venue.capacity ?? "—"}</td>
                  <td>{venue.rental_cost || "—"}</td>
                  <td>
                    <span className={`badge ${venue.is_available ? "badge-confirmed" : "badge-cancelled"}`}>
                      {venue.is_available ? "Available" : "Unavailable"}
                    </span>
                  </td>
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