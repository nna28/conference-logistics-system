import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import VenueForm from "../../components/venue/VenueForm";
import venueService from "../../services/venueService";
import BackButton from "../../components/layout/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function VenueEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    loadVenue();
  }, [id]);

  const loadVenue = async () => {
    const data = await venueService.getById(id);
    setFormData(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (payload.capacity === "") payload.capacity = 0;
      if (payload.rental_cost === "") payload.rental_cost = 0;
      await venueService.update(id, payload);
      navigate("/venues");
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  if (!formData) return <LoadingSpinner />;

  return (
    <>
      <BackButton />

      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div className="page-header-left">
          <p className="page-subtitle">Venues</p>
          <h1>Edit Venue</h1>
        </div>
      </div>

      <VenueForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitText="Save Changes"
      />
    </>
  );
}