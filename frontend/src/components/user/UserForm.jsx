import FormActions from "../layout/FormActions";

export default function UserForm({
  formData,
  setFormData,
  onSubmit,
  submitLabel = "Save",
  loading = false,
}) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="form-card">
      <div className="form-grid">

        <div className="form-group">
          <label>Full Name</label>
          <input
            name="full_name"
            placeholder="Enter full name"
            value={formData.full_name || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            name="username"
            placeholder="Enter username"
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
            placeholder="Enter email address"
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
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Consultant">Consultant</option>
            <option value="Sales Manager">Sales Manager</option>
            <option value="Booking Staff">Booking Staff</option>
            <option value="Materials Handling Staff">Materials Handling Staff</option>
            <option value="Logistics Coordinator">Logistics Coordinator</option>
          </select>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password || ""}
            onChange={handleChange}
            required
          />
        </div>

      </div>

      <FormActions submitLabel={submitLabel} loading={loading} />
    </form>
  );
}