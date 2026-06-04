import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import MaterialForm from "../../components/material/MaterialForm";

import materialService from "../../services/materialService";

export default function MaterialEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    material_name: "",
    material_type: "",
  });

  useEffect(() => {
    loadMaterial();
  }, []);

  const loadMaterial = async () => {
    const data =
      await materialService.getById(id);

    setFormData(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await materialService.update(
        id,
        formData
      );

      navigate("/materials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackButton />

      <PageHeader
        title="Edit Material"
        subtitle={`Material #${id}`}
      />

      <MaterialForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        loading={loading}
      />
    </>
  );
}