import FormActions from "../layout/FormActions";

export default function VenueForm({
  formData,
  setFormData,
  onSubmit,
  submitText = "Save",
}) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-grid">

        <div className="form-group">
          <label>Venue Name</label>
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Phone</label>
          <input
            name="contact_phone"
            value={formData.contact_phone || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full">
          <label>Address</label>
          <input
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full">
          <label>Description</label>
          <textarea
            rows="4"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Sales Manager ID</label>
          <input
            type="number"
            name="sales_manager_id"
            value={formData.sales_manager_id || ""}
            onChange={handleChange}
            required
          />
        </div>

      </div>

      <FormActions submitText={submitText} />
    </form>
  );
}