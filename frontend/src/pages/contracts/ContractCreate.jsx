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
    contract_info: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await contractService.create({
        workshop_id: Number(formData.workshop_id),
        venue_id: Number(formData.venue_id),
        contract_info: formData.contract_info,
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