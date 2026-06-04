import FormActions from "../layout/FormActions";

export default function TravelScheduleForm({
  formData,
  setFormData,
  onSubmit,
  submitLabel = "Save",
  loading = false,
}) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={onSubmit}>

      <div className="form-card">

        <div className="form-grid">

          <div className="form-group">
            <label>Workshop ID</label>
            <input
              type="number"
              name="workshop_id"
              value={formData.workshop_id || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Consultant ID</label>
            <input
              type="number"
              name="consultant_id"
              value={formData.consultant_id || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Transport Type</label>
            <input
              name="transport_type"
              value={formData.transport_type || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Departure Time</label>
            <input
              type="datetime-local"
              name="departure_time"
              value={formData.departure_time || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Departure Location</label>
            <input
              name="departure_location"
              value={formData.departure_location || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Destination</label>
            <input
              name="destination"
              value={formData.destination || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Travel Information</label>
            <textarea
              rows="5"
              name="travel_info"
              value={formData.travel_info || ""}
              onChange={handleChange}
            />
          </div>

        </div>

      </div>

      <FormActions
        submitLabel={submitLabel}
        loading={loading}
      />

    </form>
  );
}