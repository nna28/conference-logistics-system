import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import TravelScheduleForm from "../../components/travelSchedule/TravelScheduleForm";

import travelScheduleService from "../../services/travelScheduleService";

export default function TravelScheduleEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadSchedule();
  }, []);

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
      />
    </>
  );
}