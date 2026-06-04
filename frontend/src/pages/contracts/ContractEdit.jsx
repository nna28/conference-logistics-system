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
    contract_info: "",
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
        contract_info: formData.contract_info,
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
      />
    </>
  );
}