import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import MaterialShipmentForm from "../../components/materialShipment/MaterialShipmentForm";

import materialShipmentService from "../../services/materialShipmentService";
import materialRequestService from "../../services/materialRequestService";
import materialService from "../../services/materialService";

export default function MaterialShipmentEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [materialRequests, setMaterialRequests] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadOptions();
    loadShipment();
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

  const loadShipment = async () => {
    try {
      const data =
        await materialShipmentService.getById(id);

      setFormData(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await materialShipmentService.update(
        id,
        {
          packaging_status:
            formData.packaging_status,

          shipping_status:
            formData.shipping_status,
        }
      );

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
        title="Edit Shipment"
        subtitle={`Shipment #${id}`}
      />

      <MaterialShipmentForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        loading={loading}
        materialRequests={materialRequests}
        materials={materials}
      />
    </>
  );
}