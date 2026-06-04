import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import workshopService from "../../services/workshopService";

import WorkshopForm from "../../components/workshop/WorkshopForm";
import BackButton from "../../components/layout/BackButton";

function WorkshopEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const load = async () => {
      const data = await workshopService.getById(id);
      setFormData(data);
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await workshopService.update(id, formData);
    navigate("/workshops");
  };

  return (
    <>
      <BackButton />

      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div className="page-header-left">
          <p className="page-subtitle">Workshop</p>
          <h1>Edit Workshop</h1>
        </div>
      </div>

      <WorkshopForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitText="Update Workshop"
      />
    </>
  );
}

export default WorkshopEdit;