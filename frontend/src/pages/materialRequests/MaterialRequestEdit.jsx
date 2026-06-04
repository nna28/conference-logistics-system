import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import MaterialRequestForm from "../../components/materialRequest/MaterialRequestForm";

import materialRequestService from "../../services/materialRequestService";

export default function MaterialRequestEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadRequest();
  }, []);

  const loadRequest = async () => {
    const data =
      await materialRequestService.getById(id);

    if (data.request_date) {
      data.request_date =
        data.request_date.slice(0, 16);
    }

    setFormData(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await materialRequestService.update(
        id,
        formData
      );

      navigate("/material-requests");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackButton />

      <PageHeader
        title="Edit Material Request"
        subtitle={`Request #${id}`}
      />

      <MaterialRequestForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        loading={loading}
      />
    </>
  );
}