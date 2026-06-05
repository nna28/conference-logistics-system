import { useNavigate } from "react-router-dom";

export default function FormActions({
  submitLabel = "Save",
  loading = false,
}) {
  const navigate = useNavigate();

  return (
    <div className="form-actions">
      <button
        type="button"
        onClick={() => navigate(-1)}
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}