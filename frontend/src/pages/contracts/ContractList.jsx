import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/layout/PageHeader";

import contractService from "../../services/contractService";

export default function ContractList() {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const data =
        await contractService.getAll();

      setContracts(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this contract?"
      )
    ) {
      return;
    }

    try {
      await contractService.delete(id);

      loadContracts();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <PageHeader
        title="Contracts"
        subtitle="Manage contracts"
      />

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

            {contracts.map((contract) => (
              <tr key={contract.id}>

                <td>
                  {contract.id}
                </td>

                <td>
                  {contract.workshop_id}
                </td>

                <td>
                  {contract.venue_id}
                </td>

                <td>
                  {contract.status}
                </td>

                <td>

                  <Link
                    to={`/contracts/${contract.id}`}
                  >
                    View
                  </Link>

                  {" | "}

                  <Link
                    to={`/contracts/edit/${contract.id}`}
                  >
                    Edit
                  </Link>

                  {" | "}

                  <button
                    onClick={() =>
                      handleDelete(contract.id)
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