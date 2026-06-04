import FormActions from "../layout/FormActions";

function WorkshopForm({
  formData,
  setFormData,
  onSubmit,
  submitText = "Save",
}) {
  return (
    <form onSubmit={onSubmit} className="form-card">
      <div className="form-grid">

        <div>
          <label>Workshop Code</label>

          <input
            type="text"
            value={formData.workshop_code}
            onChange={(e) =>
              setFormData({
                ...formData,
                workshop_code: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Workshop Type</label>

          <input
            type="text"
            value={formData.workshop_type}
            onChange={(e) =>
              setFormData({
                ...formData,
                workshop_type: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Scheduled Time</label>

          <input
            type="datetime-local"
            value={formData.scheduled_time}
            onChange={(e) =>
              setFormData({
                ...formData,
                scheduled_time: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Expected Attendees</label>

          <input
            type="number"
            value={formData.expected_attendees}
            onChange={(e) =>
              setFormData({
                ...formData,
                expected_attendees: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Consultant ID</label>

          <input
            type="number"
            value={formData.consultant_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                consultant_id: e.target.value,
              })
            }
          />
        </div>

      </div>

      <FormActions submitText={submitText} />
    </form>
  );
}

export default WorkshopForm;