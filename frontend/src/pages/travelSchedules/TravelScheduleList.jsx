import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/layout/PageHeader";

import travelScheduleService from "../../services/travelScheduleService";

export default function TravelScheduleList() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const data =
        await travelScheduleService.getAll();

      setSchedules(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this travel schedule?"
      )
    ) {
      return;
    }

    try {
      await travelScheduleService.delete(id);

      loadSchedules();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <PageHeader
        title="Travel Schedules"
        subtitle="Manage travel schedules"
      />

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

            {schedules.map((schedule) => (
              <tr key={schedule.id}>

                <td>{schedule.id}</td>

                <td>
                  {schedule.workshop_id}
                </td>

                <td>
                  {schedule.consultant_id}
                </td>

                <td>
                  {schedule.transport_type}
                </td>

                <td>
                  {schedule.status}
                </td>

                <td>

                  <Link
                    to={`/travel-schedules/${schedule.id}`}
                  >
                    View
                  </Link>

                  {" | "}

                  <Link
                    to={`/travel-schedules/edit/${schedule.id}`}
                  >
                    Edit
                  </Link>

                  {" | "}

                  <button
                    onClick={() =>
                      handleDelete(schedule.id)
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