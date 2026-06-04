import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/layout/PageHeader";

import materialShipmentService from "../../services/materialShipmentService";

export default function MaterialShipmentList() {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      const data =
        await materialShipmentService.getAll();

      setShipments(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this shipment?"
      )
    ) {
      return;
    }

    try {
      await materialShipmentService.delete(id);

      loadShipments();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <PageHeader
        title="Material Shipments"
        subtitle="Manage shipments"
      />

      <div className="table-card">

        <table className="data-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Request</th>
              <th>Material</th>
              <th>Quantity</th>
              <th>Packaging</th>
              <th>Shipping</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {shipments.map((shipment) => (
              <tr key={shipment.id}>

                <td>
                  {shipment.id}
                </td>

                <td>
                  {shipment.material_request_id}
                </td>

                <td>
                  {shipment.material_id}
                </td>

                <td>
                  {shipment.quantity}
                </td>

                <td>
                  {shipment.packaging_status}
                </td>

                <td>
                  {shipment.shipping_status}
                </td>

                <td>

                  <Link
                    to={`/material-shipments/${shipment.id}`}
                  >
                    View
                  </Link>

                  {" | "}

                  <Link
                    to={`/material-shipments/edit/${shipment.id}`}
                  >
                    Edit
                  </Link>

                  {" | "}

                  <button
                    onClick={() =>
                      handleDelete(shipment.id)
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