import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import materialShipmentService from "../../services/materialShipmentService";

export default function MaterialShipmentDetail() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result =
        await materialShipmentService.getOverview(id);

      setData(result);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <BackButton />

      <PageHeader
        title={`Shipment #${id}`}
        subtitle="Shipment Detail"
      />

      <div className="detail-card">

        <p>
          <strong>Request ID:</strong>{" "}
          {data.material_request?.id}
        </p>

        <p>
          <strong>Material:</strong>{" "}
          {data.material?.material_name}
        </p>

        <p>
          <strong>Quantity:</strong>{" "}
          {data.shipment.quantity}
        </p>

        <p>
          <strong>Packaging Status:</strong>{" "}
          {data.shipment.packaging_status}
        </p>

        <p>
          <strong>Shipping Status:</strong>{" "}
          {data.shipment.shipping_status}
        </p>

      </div>
    </>
  );
}