import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";

import workshopService from "../../services/workshopService";

import WorkshopForm from "../../components/workshop/WorkshopForm";

import BackButton from "../../components/layout/BackButton";

function WorkshopEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({});

  useEffect(() => {
    const load = async () => {
      const data =
        await workshopService.getById(id);

      setFormData(data);
    };

    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await workshopService.update(
      id,
      formData
    );

    navigate("/workshops");
  };

  return (
    <>
      <BackButton />

      <h2>Edit Workshop</h2>

      <WorkshopForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitText="Update"
      />
    </>
  );
}

export default WorkshopEdit;