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

      await materialRequestService.create(
        formData
      );

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