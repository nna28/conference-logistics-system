import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import MaterialRequestForm from "../../components/materialRequest/MaterialRequestForm";

import materialRequestService from "../../services/materialRequestService";
import workshopService from "../../services/workshopService";

export default function MaterialRequestCreate() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const wsData = await workshopService.getAll();
      setWorkshops(wsData);
    } catch (error) {
      console.error(error);
    }
  };

  const [formData, setFormData] = useState({
    workshop_id: "",
    request_date: "",
    delivery_address: "",
    registered_attendees: "",
    packaging_status: "PENDING",
    shipping_status: "PENDING",
    status: "PENDING",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = { ...formData };
      if (payload.workshop_id === "") payload.workshop_id = null;
      if (payload.request_date === "") payload.request_date = null;
      if (payload.registered_attendees === "") payload.registered_attendees = null;

      await materialRequestService.create(payload);

      navigate("/material-requests");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackButton />

      <PageHeader
        title="Create Material Request"
        subtitle="Create a new request"
      />

      <MaterialRequestForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitLabel="Create Request"
        loading={loading}
        workshops={workshops}
      />
    </>
  );
}