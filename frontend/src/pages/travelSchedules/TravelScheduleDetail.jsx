import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import travelScheduleService from "../../services/travelScheduleService";

export default function TravelScheduleDetail() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result =
        await travelScheduleService.getOverview(id);

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
        title={`Travel Schedule #${id}`}
        subtitle="Travel Schedule Detail"
      />

      <div className="detail-card">

        <p>
          <strong>Workshop:</strong>{" "}
          {data.workshop?.workshop_code}
        </p>

        <p>
          <strong>Consultant:</strong>{" "}
          {data.consultant?.full_name}
        </p>

        <p>
          <strong>Transport:</strong>{" "}
          {data.travel_schedule.transport_type}
        </p>

        <p>
          <strong>Departure:</strong>{" "}
          {data.travel_schedule.departure_location}
        </p>

        <p>
          <strong>Destination:</strong>{" "}
          {data.travel_schedule.destination}
        </p>

        <p>
          <strong>Time:</strong>{" "}
          {data.travel_schedule.departure_time}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {data.travel_schedule.status}
        </p>

        <p>
          <strong>Travel Info:</strong>
        </p>

        <p>
          {data.travel_schedule.travel_info}
        </p>

      </div>
    </>
  );
}