import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import ContractForm from "../../components/contract/ContractForm";

import contractService from "../../services/contractService";

export default function ContractCreate() {
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
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await contractService.create({
        workshop_id: Number(formData.workshop_id),
        venue_id: Number(formData.venue_id),
        sales_manager_id: formData.sales_manager_id ? Number(formData.sales_manager_id) : null,
        meeting_rooms: formData.meeting_rooms ? Number(formData.meeting_rooms) : null,
        seating_style: formData.seating_style || null,
        av_requirements: formData.av_requirements || null,
        revision_notes: formData.revision_notes || null,
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
        title="Create Contract"
        subtitle="Create a new contract"
      />

      <ContractForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitLabel="Create Contract"
        loading={loading}
      />
    </>
  );
}