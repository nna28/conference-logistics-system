import { useNavigate } from "react-router-dom";
import { useState } from "react";

import VenueForm from "../../components/venue/VenueForm";
import venueService from "../../services/venueService";
import BackButton from "../../components/layout/BackButton";

export default function VenueCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    room_type: "",
    capacity: "",
    rental_cost: "",
    equipment_supported: "",
    is_available: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (payload.capacity === "") payload.capacity = 0;
      if (payload.rental_cost === "") payload.rental_cost = 0;
      await venueService.create(payload);
      navigate("/venues");
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  return (
    <>
      <BackButton />

      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div className="page-header-left">
          <p className="page-subtitle">Venues</p>
          <h1>Create New Venue</h1>
        </div>
      </div>

      <VenueForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitText="Create Venue"
      />
    </>
  );
}