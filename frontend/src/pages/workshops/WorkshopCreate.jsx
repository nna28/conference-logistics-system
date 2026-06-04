import { useState } from "react";
import { useNavigate } from "react-router-dom";

import workshopService from "../../services/workshopService";

import WorkshopForm from "../../components/workshop/WorkshopForm";
import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

function WorkshopCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    workshop_code: "",
    workshop_type: "",
    scheduled_time: "",
    expected_attendees: "",
    consultant_id: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await workshopService.create(formData);

    navigate("/workshops");
  };

  return (
    <>
      <BackButton />

      <PageHeader
        title="Create Workshop"
      />

      <WorkshopForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitText="Create"
      />
    </>
  );
}

export default WorkshopCreate;