import FormActions from "../layout/FormActions";

export default function MaterialForm({
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
              Material Name
            </label>

            <input
              name="material_name"
              value={formData.material_name || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Material Type
            </label>

            <select
              name="material_type"
              value={formData.material_type || ""}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Type --</option>
              <option value="Document">Document</option>
              <option value="Equipment">Equipment</option>
              <option value="Stationery">Stationery</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
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