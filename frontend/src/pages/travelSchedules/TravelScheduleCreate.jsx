import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import TravelScheduleForm from "../../components/travelSchedule/TravelScheduleForm";

import travelScheduleService from "../../services/travelScheduleService";

export default function TravelScheduleCreate() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    workshop_id: "",
    consultant_id: "",
    transport_type: "",
    departure_location: "",
    destination: "",
    departure_time: "",
    travel_info: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await travelScheduleService.create(formData);

      navigate("/travel-schedules");
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
        title="Create Travel Schedule"
        subtitle="Create a new travel schedule"
      />

      <TravelScheduleForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitLabel="Create Travel Schedule"
        loading={loading}
      />
    </>
  );
}