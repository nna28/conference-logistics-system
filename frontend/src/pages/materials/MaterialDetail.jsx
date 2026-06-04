import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import materialService from "../../services/materialService";

export default function MaterialDetail() {
  const { id } = useParams();

  const [material, setMaterial] = useState(null);

  useEffect(() => {
    loadMaterial();
  }, []);

  const loadMaterial = async () => {
    const data =
      await materialService.getById(id);

    setMaterial(data);
  };

  if (!material) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <BackButton />

      <PageHeader
        title={material.material_name}
        subtitle="Material Detail"
      />

      <div className="detail-card">

        <p>
          <strong>ID:</strong>{" "}
          {material.id}
        </p>

        <p>
          <strong>Name:</strong>{" "}
          {material.material_name}
        </p>

        <p>
          <strong>Type:</strong>{" "}
          {material.material_type}
        </p>

      </div>
    </>
  );
}