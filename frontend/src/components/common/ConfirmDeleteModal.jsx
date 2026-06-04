export default function ConfirmDeleteModal({
  open,
  title = "Delete Item",
  message = "Are you sure?",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div className="modal-card">

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="modal-actions">

          <button
            onClick={onCancel}
            className="cancel-btn"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="delete-btn"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}