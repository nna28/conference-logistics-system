import FormActions from "../layout/FormActions";

export default function VenueForm({
  formData,
  setFormData,
  onSubmit,
  submitText = "Save",
}) {
  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      {/* Basic Info Section */}
      <div className="form-card" style={{ marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "16px", fontSize: "16px", color: "var(--primary-color)" }}>📍 Basic Information</h3>
        <div className="form-grid">
          <div className="form-group full">
            <label>Venue Name</label>
            <input
              name="name"
              placeholder="e.g. Grand Plaza Convention Center"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full">
            <label>Address</label>
            <input
              name="address"
              placeholder="e.g. 117 Tran Duy Hung, Hanoi"
              value={formData.address || ""}
              onChange={handleChange}
              required
            />
          </div>

        </div>
      </div>

      {/* Facilities & Pricing Section */}
      <div className="form-card" style={{ marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "16px", fontSize: "16px", color: "var(--primary-color)" }}>🏢 Facilities & Pricing</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Room Type</label>
            <select
              name="room_type"
              value={formData.room_type || ""}
              onChange={handleChange}
            >
              <option value="">— Select type —</option>
              <option value="Conference Hall">Conference Hall</option>
              <option value="Meeting Room">Meeting Room</option>
              <option value="Auditorium">Auditorium</option>
              <option value="Ballroom">Ballroom</option>
              <option value="Workshop Space">Workshop Space</option>
            </select>
          </div>

          <div className="form-group">
            <label>Capacity (Seats)</label>
            <input
              type="number"
              name="capacity"
              placeholder="e.g. 500"
              value={formData.capacity || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Rental Cost</label>
            <input
              type="number"
              name="rental_cost"
              placeholder="e.g. 1000"
              value={formData.rental_cost || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginTop: "24px" }}>
              <input
                type="checkbox"
                name="is_available"
                checked={!!formData.is_available}
                onChange={handleChange}
                style={{ width: "18px", height: "18px", accentColor: "var(--primary-color)", cursor: "pointer" }}
              />
              <span style={{ fontWeight: 600 }}>Available for Booking</span>
            </label>
          </div>

          <div className="form-group full">
            <label>Supported Equipment (AV, Wi-Fi, Projectors, etc.)</label>
            <textarea
              rows="2"
              name="equipment_supported"
              placeholder="e.g. 4K Projector, Surround Sound, High-speed Wi-Fi"
              value={formData.equipment_supported || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <FormActions submitText={submitText} />
    </form>
  );
}