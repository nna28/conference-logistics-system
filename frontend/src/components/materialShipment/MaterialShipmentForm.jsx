import FormActions from "../layout/FormActions";

export default function MaterialShipmentForm({
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
              Material Request ID
            </label>

            <input
              type="number"
              name="material_request_id"
              value={
                formData.material_request_id || ""
              }
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Material ID
            </label>

            <input
              type="number"
              name="material_id"
              value={formData.material_id || ""}
              onChange={handleChange}
              required
            />
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
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Packed">
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
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Shipping">
                    Shipping
                  </option>

                  <option value="Delivered">
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