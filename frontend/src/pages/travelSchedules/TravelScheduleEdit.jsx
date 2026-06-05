import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import TravelScheduleForm from "../../components/travelSchedule/TravelScheduleForm";

import travelScheduleService from "../../services/travelScheduleService";
import workshopService from "../../services/workshopService";
import userService from "../../services/userService";

export default function TravelScheduleEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [workshops, setWorkshops] = useState([]);
  const [consultants, setConsultants] = useState([]);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadOptions();
    loadSchedule();
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

  const loadSchedule = async () => {
    try {
      const data =
        await travelScheduleService.getById(id);

      if (data.departure_time) {
        data.departure_time =
          data.departure_time.slice(0, 16);
      }

      setFormData(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await travelScheduleService.update(
        id,
        formData
      );

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
        title="Edit Travel Schedule"
        subtitle={`Schedule #${id}`}
      />

      <TravelScheduleForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        loading={loading}
        workshops={workshops}
        consultants={consultants}
      />
    </>
  );
}