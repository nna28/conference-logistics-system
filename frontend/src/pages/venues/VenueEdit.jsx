import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import VenueForm from "../../components/venue/VenueForm";
import venueService from "../../services/venueService";

export default function VenueEdit() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadVenue();
  }, []);

  const loadVenue = async () => {
    const data = await venueService.getById(id);
    setFormData(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await venueService.update(id, formData);

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
      submitText="Save Changes"
    />
  );
}