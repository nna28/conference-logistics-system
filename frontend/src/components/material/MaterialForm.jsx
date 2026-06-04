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

            <input
              name="material_type"
              value={formData.material_type || ""}
              onChange={handleChange}
              required
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