import { useNavigate } from "react-router-dom";
import { useState } from "react";

import VenueForm from "../../components/venue/VenueForm";
import venueService from "../../services/venueService";

export default function VenueCreate() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact_phone: "",
    description: "",
    sales_manager_id: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await venueService.create(formData);

      navigate("/venues");

    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  return (
    <VenueForm
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      submitText="Create Venue"
    />
  );
}