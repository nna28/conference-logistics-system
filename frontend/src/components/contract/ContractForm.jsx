import FormActions from "../layout/FormActions";

export default function ContractForm({
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
            <label>
              Workshop ID
            </label>

            <input
              type="number"
              name="workshop_id"
              value={formData.workshop_id || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Venue ID
            </label>

            <input
              type="number"
              name="venue_id"
              value={formData.venue_id || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>
              Contract Information
            </label>

            <textarea
              rows="6"
              name="contract_info"
              value={formData.contract_info || ""}
              onChange={handleChange}
              required
            />
          </div>

          {"status" in formData && (
            <div className="form-group">
              <label>
                Status
              </label>

              <select
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
              >
                <option value="Draft">
                  Draft
                </option>

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