import FormActions from "../layout/FormActions";

export default function UserForm({
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
            <label>Full Name</label>

            <input
              name="full_name"
              value={formData.full_name || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Username</label>

            <input
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>

            <select
              name="role"
              value={formData.role || ""}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Role
              </option>

              <option value="Admin">
                Admin
              </option>

              <option value="Consultant">
                Consultant
              </option>

              <option value="Sales Manager">
                Sales Manager
              </option>

              <option value="Logistics Coordinator">
                Logistics Coordinator
              </option>

            </select>
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password || ""}
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