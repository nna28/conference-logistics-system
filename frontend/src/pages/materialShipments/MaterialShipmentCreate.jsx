import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import MaterialShipmentForm from "../../components/materialShipment/MaterialShipmentForm";

import materialShipmentService from "../../services/materialShipmentService";
import materialRequestService from "../../services/materialRequestService";
import materialService from "../../services/materialService";

export default function MaterialShipmentCreate() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [materialRequests, setMaterialRequests] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [reqData, matData] = await Promise.all([
        materialRequestService.getAll(),
        materialService.getAll()
      ]);
      setMaterialRequests(reqData);
      setMaterials(matData);
    } catch (error) {
      console.error(error);
    }
  };

  const [formData, setFormData] = useState({
    material_request_id: "",
    material_id: "",
    quantity: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await materialShipmentService.create({
        material_request_id: Number(
          formData.material_request_id
        ),
        material_id: Number(
          formData.material_id
        ),
        quantity: Number(
          formData.quantity
        ),
      });

      navigate("/material-shipments");
    } catch (error) {
      alert(error.response?.data?.detail || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackButton />

      <PageHeader
        title="Create Shipment"
        subtitle="Create a new material shipment"
      />

      <MaterialShipmentForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitLabel="Create Shipment"
        loading={loading}
        materialRequests={materialRequests}
        materials={materials}
      />
    </>
  );
}