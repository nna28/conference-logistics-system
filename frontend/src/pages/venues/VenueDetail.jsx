import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import venueService from "../../services/venueService";

export default function VenueDetail() {

  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    loadDetail();
  }, []);

  const loadDetail = async () => {
    const result =
      await venueService.getOverview(id);

    setData(result);
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="glass-card">
      <h2>{data.venue.name}</h2>

      <p>{data.venue.address}</p>

      <p>{data.venue.contact_phone}</p>

      <p>{data.venue.description}</p>

      {data.sales_manager && (
        <p>
          Sales Manager:
          {" "}
          {data.sales_manager.full_name}
        </p>
      )}
    </div>
  );
}