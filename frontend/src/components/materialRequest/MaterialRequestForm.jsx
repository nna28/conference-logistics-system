import FormActions from "../layout/FormActions";

export default function MaterialRequestForm({
  formData,
  setFormData,
  onSubmit,
  submitLabel = "Save",
  loading = false,
  workshops = [],
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
                  {w.workshop_code} - {w.expected_attendees || 0} attendees ({w.city || "No City"})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity Needed</label>
            <input
              type="number"
              name="quantity_needed"
              value={formData.quantity_needed || ""}
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

          <div className="form-group full-width" style={{ padding: "12px", background: "var(--bg-card-hover)", borderRadius: "8px", border: "1px dashed var(--border-color)" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>
              ℹ️ <strong>Note:</strong> Delivery Address will be automatically calculated based on the Workshop's Venue Contract.
            </p>
          </div>

          {"status" in formData && (
            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="APPROVED">
                  Approved
                </option>

                <option value="REJECTED">
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
