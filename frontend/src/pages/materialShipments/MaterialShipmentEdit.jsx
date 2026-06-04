import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import MaterialShipmentForm from "../../components/materialShipment/MaterialShipmentForm";

import materialShipmentService from "../../services/materialShipmentService";

export default function MaterialShipmentEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadShipment();
  }, []);

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
      />
    </>
  );
}