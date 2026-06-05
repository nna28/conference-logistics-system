import { useState, useEffect } from "react";
import FormActions from "../layout/FormActions";
import userService from "../../services/userService";

function WorkshopForm({
  formData,
  setFormData,
  onSubmit,
  submitText = "Save",
  isEdit = false,
}) {
  const [consultants, setConsultants] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await userService.getAll();
        const trainers = users.filter(
          (u) => u.role === "Consultant" || u.role === "Training Consultant"
        );
        setConsultants(trainers); // Only show role "Consultant" or "Training Consultant"
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const set = (key) => (e) =>
    setFormData({ ...formData, [key]: e.target.value });

  return (
    <form onSubmit={onSubmit} className="form-card">
      <div className="form-grid">
        {isEdit && (
          <div className="form-group">
            <label>Workshop Code</label>
            <input
              type="text"
              placeholder="e.g. WS-2024-001"
              value={formData.workshop_code || ""}
              readOnly
            />
          </div>
        )}

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
          <label>City</label>
          <input
            type="text"
            placeholder="e.g. HCM, HN"
            value={formData.city || ""}
            onChange={set("city")}
          />
        </div>

        <div className="form-group">
          <label>Training Consultant</label>
          <select value={formData.trainer_id || ""} onChange={set("trainer_id")}>
            <option value="">-- Select a Training Consultant --</option>
            {consultants.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name} ({c.username})
              </option>
            ))}
          </select>
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

        {isEdit && (
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
        )}
      </div>

      <FormActions submitLabel={submitText} />
    </form>
  );
}

export default WorkshopForm;