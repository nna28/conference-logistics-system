import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/layout/PageHeader";

import materialService from "../../services/materialService";

export default function MaterialList() {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    const data =
      await materialService.getAll();

    setMaterials(data);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this material?"
      )
    ) {
      return;
    }

    await materialService.delete(id);

    loadMaterials();
  };

  return (
    <>
      <PageHeader
        title="Materials"
        subtitle="Manage materials"
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

            {materials.map((material) => (
              <tr key={material.id}>

                <td>{material.id}</td>

                <td>
                  {material.material_name}
                </td>

                <td>
                  {material.material_type}
                </td>

                <td>

                  <Link
                    to={`/materials/${material.id}`}
                  >
                    View
                  </Link>

                  {" | "}

                  <Link
                    to={`/materials/edit/${material.id}`}
                  >
                    Edit
                  </Link>

                  {" | "}

                  <button
                    onClick={() =>
                      handleDelete(material.id)
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