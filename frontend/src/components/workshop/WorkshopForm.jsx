import FormActions from "../layout/FormActions";

function WorkshopForm({
  formData,
  setFormData,
  onSubmit,
  submitText = "Save",
}) {
  const set = (key) => (e) =>
    setFormData({ ...formData, [key]: e.target.value });

  return (
    <form onSubmit={onSubmit} className="form-card">

      <div className="form-grid">

        <div className="form-group">
          <label>Workshop Code</label>
          <input
            type="text"
            placeholder="e.g. WS-2024-001"
            value={formData.workshop_code || ""}
            onChange={set("workshop_code")}
          />
        </div>

        <div className="form-group">
          <label>Workshop Type</label>
          <input
            type="text"
            placeholder="e.g. Technical, Sales"
            value={formData.workshop_type || ""}
            onChange={set("workshop_type")}
          />
        </div>

        <div className="form-group">
          <label>Scheduled Time</label>
          <input
            type="datetime-local"
            value={formData.scheduled_time || ""}
            onChange={set("scheduled_time")}
          />
        </div>

        <div className="form-group">
          <label>Expected Attendees</label>
          <input
            type="number"
            placeholder="e.g. 50"
            value={formData.expected_attendees || ""}
            onChange={set("expected_attendees")}
          />
        </div>

        <div className="form-group">
          <label>Trainer ID</label>
          <input
            type="number"
            placeholder="User ID of trainer"
            value={formData.trainer_id || ""}
            onChange={set("trainer_id")}
          />
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            placeholder="e.g. HCM, HN"
            value={formData.city || ""}
            onChange={set("city")}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            value={formData.status || "PENDING"}
            onChange={set("status")}
          >
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

      </div>

      <FormActions submitLabel={submitText} />
    </form>
  );
}

export default WorkshopForm;