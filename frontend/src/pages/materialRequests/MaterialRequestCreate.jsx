import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import MaterialRequestForm from "../../components/materialRequest/MaterialRequestForm";

import materialRequestService from "../../services/materialRequestService";

export default function MaterialRequestCreate() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    workshop_id: "",
    request_date: "",
    delivery_address: "",
    registered_attendees: "",
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
      />
    </>
  );
}