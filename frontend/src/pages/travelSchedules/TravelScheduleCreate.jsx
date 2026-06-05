import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import TravelScheduleForm from "../../components/travelSchedule/TravelScheduleForm";

import travelScheduleService from "../../services/travelScheduleService";
import workshopService from "../../services/workshopService";
import userService from "../../services/userService";

export default function TravelScheduleCreate() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [workshops, setWorkshops] = useState([]);
  const [consultants, setConsultants] = useState([]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [wsData, usersData] = await Promise.all([
        workshopService.getAll(),
        userService.getAll(),
      ]);
      setWorkshops(wsData);
      setConsultants(usersData.filter(u => u.role === "Training Consultant" || u.role === "Consultant"));
    } catch (error) {
      console.error("Failed to load options", error);
    }
  };

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

      const payload = { ...formData };
      if (payload.workshop_id === "") payload.workshop_id = null;
      if (payload.consultant_id === "") payload.consultant_id = null;
      if (payload.departure_time === "") payload.departure_time = null;
      await travelScheduleService.create(payload);

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
        workshops={workshops}
        consultants={consultants}
      />
    </>
  );
}