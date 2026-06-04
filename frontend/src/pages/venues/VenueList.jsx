import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

import venueService from "../../services/venueService";

export default function VenueList() {
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this venue?"
    );

    if (!confirmed) return;

    try {
      await venueService.delete(id);

      loadVenues();

    } catch (err) {
      alert(
        err.response?.data?.detail ||
          err.message
      );
    }
  };

  if (loading) {
    return <p>Loading venues...</p>;
  }

  return (
    <div className="fade-in">

      <div className="page-header">

        <div>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              marginBottom: "4px",
            }}
          >
            Manage venue information
          </p>

          <h3 className="page-title">
            List of Venues
          </h3>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            navigate("/venues/new")
          }
        >
          <Plus size={16} />
          New Venue
        </button>

      </div>

      <div className="glass-card table-card">

        <div className="table-wrapper">

          <table className="data-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Sales Manager</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {venues.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No venues found
                  </td>
                </tr>
              ) : (
                venues.map((venue, index) => (
                  <tr key={venue.id}>

                    <td>
                      #{index + 1}
                    </td>

                    <td>{venue.name}</td>

                    <td>{venue.address}</td>

                    <td>
                      {venue.contact_phone}
                    </td>

                    <td>
                      {venue.sales_manager_id}
                    </td>

                    <td>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                        }}
                      >

                        <button
                          className="btn-view"
                          onClick={() =>
                            navigate(
                              `/venues/${venue.id}`
                            )
                          }
                        >
                          <Eye size={14} />
                          View
                        </button>

                        <button
                          className="btn-view"
                          onClick={() =>
                            navigate(
                              `/venues/edit/${venue.id}`
                            )
                          }
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          className="btn-delete"
                          onClick={() =>
                            handleDelete(
                              venue.id
                            )
                          }
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}