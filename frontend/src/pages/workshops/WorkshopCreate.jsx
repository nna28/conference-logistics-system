import { useState } from "react";
import { useNavigate } from "react-router-dom";

import workshopService from "../../services/workshopService";
import WorkshopForm from "../../components/workshop/WorkshopForm";
import BackButton from "../../components/layout/BackButton";

function WorkshopCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    workshop_code: "",
    workshop_type: "",
    scheduled_time: "",
    expected_attendees: "",
    trainer_id: "",
    city: "",
    status: "PENDING",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (payload.expected_attendees === "") payload.expected_attendees = null;
    if (payload.trainer_id === "") payload.trainer_id = null;
    if (payload.scheduled_time === "") payload.scheduled_time = null;
    if (!payload.workshop_code) {
      payload.workshop_code = "WS-" + Date.now().toString().slice(-6);
    }

    await workshopService.create(payload);
    navigate("/workshops");
  };

  return (
    <>
      <BackButton />

      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div className="page-header-left">
          <p className="page-subtitle">Workshops</p>
          <h1>Create New Workshop</h1>
        </div>
      </div>

      <WorkshopForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitText="Create Workshop"
      />
    </>
  );
}

export default WorkshopCreate;