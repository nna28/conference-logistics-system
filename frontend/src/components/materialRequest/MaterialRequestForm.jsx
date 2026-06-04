import FormActions from "../layout/FormActions";

export default function MaterialRequestForm({
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
            <label>Request Date</label>
            <input
              type="datetime-local"
              name="request_date"
              value={formData.request_date || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Delivery Address</label>
            <input
              name="delivery_address"
              value={formData.delivery_address || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Registered Attendees</label>
            <input
              type="number"
              name="registered_attendees"
              value={
                formData.registered_attendees || ""
              }
              onChange={handleChange}
              required
            />
          </div>

          {"status" in formData && (
            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>
            </div>
          )}

        </div>

      </div>

      <FormActions
        submitLabel={submitLabel}
        loading={loading}
      />

    </form>
  );
}
