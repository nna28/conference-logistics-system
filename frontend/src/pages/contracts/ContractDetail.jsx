import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import contractService from "../../services/contractService";

export default function ContractDetail() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result =
        await contractService.getOverview(id);

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
        title={`Contract #${data.contract.id}`}
        subtitle="Contract Detail"
      />

      <div className="detail-card">

        <p>
          <strong>Workshop:</strong>{" "}
          {data.workshop?.workshop_code}
        </p>

        <p>
          <strong>Venue:</strong>{" "}
          {data.venue?.name}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {data.contract.status}
        </p>

        <p>
          <strong>Information:</strong>
        </p>

        <p>
          {data.contract.contract_info}
        </p>

      </div>
    </>
  );
}