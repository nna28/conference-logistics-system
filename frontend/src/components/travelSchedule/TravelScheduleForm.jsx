import FormActions from "../layout/FormActions";

export default function TravelScheduleForm({
  formData,
  setFormData,
  onSubmit,
  submitLabel = "Save",
  loading = false,
  workshops = [],
  consultants = [],
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
            <label>Workshop</label>
            <select
              name="workshop_id"
              value={formData.workshop_id || ""}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Workshop --</option>
              {workshops.map(w => (
                <option key={w.id} value={w.id}>
                  {w.workshop_code} ({w.city || "No City"})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Consultant</label>
            <select
              name="consultant_id"
              value={formData.consultant_id || ""}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Consultant --</option>
              {consultants.map(c => (
                <option key={c.id} value={c.id}>
                  {c.full_name} (@{c.username})
                </option>
              ))}
            </select>
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