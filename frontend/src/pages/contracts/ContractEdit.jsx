import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import ContractForm from "../../components/contract/ContractForm";

import contractService from "../../services/contractService";

export default function ContractEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    workshop_id: "",
    venue_id: "",
    sales_manager_id: "",
    meeting_rooms: "",
    seating_style: "",
    av_requirements: "",
    revision_notes: "",
    status: "Draft",
  });

  useEffect(() => {
    loadContract();
  }, []);

  const loadContract = async () => {
    try {
      const data = await contractService.getById(id);
      setFormData(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await contractService.update(id, {
        sales_manager_id: formData.sales_manager_id ? Number(formData.sales_manager_id) : null,
        meeting_rooms: formData.meeting_rooms ? Number(formData.meeting_rooms) : null,
        seating_style: formData.seating_style || null,
        av_requirements: formData.av_requirements || null,
        revision_notes: formData.revision_notes || null,
        status: formData.status,
      });

      navigate("/contracts");
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
        title="Edit Contract"
        subtitle={`Contract #${id}`}
      />

      <ContractForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        loading={loading}
        isEdit={true}
      />
    </>
  );
}