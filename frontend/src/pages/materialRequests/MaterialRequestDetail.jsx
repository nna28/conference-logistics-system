import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import materialRequestService from "../../services/materialRequestService";

export default function MaterialRequestDetail() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result =
      await materialRequestService.getOverview(id);

    setData(result);
  };

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <BackButton />

      <PageHeader
        title={`Request #${id}`}
        subtitle="Material Request Detail"
      />

      <div className="detail-card">

        <p>
          <strong>Workshop:</strong>{" "}
          {data.workshop?.workshop_code}
        </p>

        <p>
          <strong>Request Date:</strong>{" "}
          {data.material_request.request_date}
        </p>

        <p>
          <strong>Address:</strong>{" "}
          {data.material_request.delivery_address}
        </p>

        <p>
          <strong>Attendees:</strong>{" "}
          {data.material_request.registered_attendees}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {data.material_request.status}
        </p>

      </div>
    </>
  );
}