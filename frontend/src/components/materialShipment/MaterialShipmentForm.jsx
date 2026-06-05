import FormActions from "../layout/FormActions";

export default function MaterialShipmentForm({
  formData,
  setFormData,
  onSubmit,
  submitLabel = "Save",
  loading = false,
  materialRequests = [],
  materials = [],
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
            <label>Material Request</label>
            <select
              name="material_request_id"
              value={formData.material_request_id || ""}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Request --</option>
              {materialRequests.map(r => (
                <option key={r.id} value={r.id}>
                  Request #{r.id} ({r.delivery_address || "No Address"})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Material</label>
            <select
              name="material_id"
              value={formData.material_id || ""}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Material --</option>
              {materials.map(m => (
                <option key={m.id} value={m.id}>
                  {m.material_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Quantity
            </label>

            <input
              type="number"
              name="quantity"
              value={formData.quantity || ""}
              onChange={handleChange}
              required
            />
          </div>

          {"packaging_status" in formData && (
            <>
              <div className="form-group">
                <label>
                  Packaging Status
                </label>

                <select
                  name="packaging_status"
                  value={
                    formData.packaging_status || ""
                  }
                  onChange={handleChange}
                >
                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="PACKED">
                    Packed
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Shipping Status
                </label>

                <select
                  name="shipping_status"
                  value={
                    formData.shipping_status || ""
                  }
                  onChange={handleChange}
                >
                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="SHIPPING">
                    Shipping
                  </option>

                  <option value="DELIVERED">
                    Delivered
                  </option>
                </select>
              </div>
            </>
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