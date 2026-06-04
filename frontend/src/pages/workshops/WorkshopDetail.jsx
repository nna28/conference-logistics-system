import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import workshopService from "../../services/workshopService";

import BackButton from "../../components/layout/BackButton";

function WorkshopDetail() {
  const { id } = useParams();

  const [data, setData] =
    useState(null);

  useEffect(() => {
    const load = async () => {
      const res =
        await workshopService.getOverview(id);

      setData(res);
    };

    load();
  }, [id]);

  if (!data) return null;

  return (
    <>
      <BackButton />

      <h2>
        Workshop Overview
      </h2>

      <div className="detail-card">
        <h3>
          {data.workshop.workshop_code}
        </h3>

        <p>
          Type:
          {" "}
          {data.workshop.workshop_type}
        </p>

        <p>
          Status:
          {" "}
          {data.workshop.status}
        </p>

        <p>
          Consultant:
          {" "}
          {data.consultant?.full_name}
        </p>
      </div>

      <div className="detail-card">
        <h3>Contracts</h3>

        {data.contracts?.length}
      </div>

      <div className="detail-card">
        <h3>Venues</h3>

        {data.venues?.length}
      </div>

      <div className="detail-card">
        <h3>
          Travel Schedules
        </h3>

        {data.travel_schedules?.length}
      </div>

      <div className="detail-card">
        <h3>
          Material Requests
        </h3>

        {data.material_requests?.length}
      </div>

      <div className="detail-card">
        <h3>Shipments</h3>

        {data.shipments?.length}
      </div>
    </>
  );
}

export default WorkshopDetail;