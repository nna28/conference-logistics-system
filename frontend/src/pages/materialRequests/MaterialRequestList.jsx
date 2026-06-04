import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/layout/PageHeader";

import materialRequestService from "../../services/materialRequestService";

export default function MaterialRequestList() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const data =
      await materialRequestService.getAll();

    setRequests(data);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this material request?"
      )
    ) {
      return;
    }

    await materialRequestService.delete(id);

    loadRequests();
  };

  return (
    <>
      <PageHeader
        title="Material Requests"
        subtitle="Manage requests"
      />

      <div className="table-card">

        <table className="data-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Workshop</th>
              <th>Attendees</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {requests.map((request) => (
              <tr key={request.id}>

                <td>{request.id}</td>

                <td>
                  {request.workshop_id}
                </td>

                <td>
                  {request.registered_attendees}
                </td>

                <td>
                  {request.status}
                </td>

                <td>

                  <Link
                    to={`/material-requests/${request.id}`}
                  >
                    View
                  </Link>

                  {" | "}

                  <Link
                    to={`/material-requests/edit/${request.id}`}
                  >
                    Edit
                  </Link>

                  {" | "}

                  <button
                    onClick={() =>
                      handleDelete(request.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </>
  );
}