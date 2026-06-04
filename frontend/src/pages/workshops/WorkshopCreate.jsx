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