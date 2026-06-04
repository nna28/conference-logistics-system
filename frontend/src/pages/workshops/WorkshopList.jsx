import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import workshopService from "../../services/workshopService";

import SearchBar from "../../components/common/SearchBar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import PageHeader from "../../components/layout/PageHeader";

function WorkshopList() {
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

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async () => {
    await workshopService.delete(deleteId);

    setDeleteId(null);

    loadData();
  };

  const filtered = workshops.filter((item) =>
    item.workshop_code
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader
        title="Workshop Management"
        buttonText="New Workshop"
        buttonLink="/workshops/new"
      />

      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Workshop Code</th>
            <th>Type</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>

              <td>{item.workshop_code}</td>

              <td>{item.workshop_type}</td>

              <td>{item.status}</td>

              <td>
                <Link
                  to={`/workshops/${item.id}`}
                >
                  Detail
                </Link>

                {" | "}

                <Link
                  to={`/workshops/edit/${item.id}`}
                >
                  Edit
                </Link>

                {" | "}

                <button
                  onClick={() =>
                    setDeleteId(item.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDeleteModal
        isOpen={deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default WorkshopList;