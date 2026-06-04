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