import { useState, useEffect } from "react";
import FormActions from "../layout/FormActions";
import workshopService from "../../services/workshopService";
import venueService from "../../services/venueService";
import userService from "../../services/userService";

export default function ContractForm({
  formData,
  setFormData,
  onSubmit,
  submitLabel = "Save",
  loading = false,
  isEdit = false,
}) {
  const [workshops, setWorkshops] = useState([]);
  const [venues, setVenues] = useState([]);
  const [salesManagers, setSalesManagers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wsData, vData, uData] = await Promise.all([
          workshopService.getAll(),
          venueService.getAll(),
          userService.getAll(),
        ]);
        setWorkshops(wsData);
        setVenues(vData);
        setSalesManagers(uData.filter((u) => u.role === "Sales Manager"));
      } catch (err) {
        console.error("Failed to fetch references:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      {/* Core Linking Section */}
      <div className="form-card" style={{ marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "16px", fontSize: "16px", color: "var(--primary-color)" }}>🔗 Linkages</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Workshop</label>
            <select
              name="workshop_id"
              value={formData.workshop_id || ""}
              onChange={handleChange}
              required
              disabled={isEdit}
            >
              <option value="">-- Select Workshop --</option>
              {workshops.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.workshop_code} ({ws.workshop_type} - {ws.city})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Venue</label>
            <select
              name="venue_id"
              value={formData.venue_id || ""}
              onChange={handleChange}
              required
              disabled={isEdit}
            >
              <option value="">-- Select Venue --</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.city || v.address})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sales Manager (Optional)</label>
            <select
              name="sales_manager_id"
              value={formData.sales_manager_id || ""}
              onChange={handleChange}
            >
              <option value="">-- Select Sales Manager --</option>
              {salesManagers.map((sm) => (
                <option key={sm.id} value={sm.id}>
                  {sm.full_name} ({sm.username})
                </option>
              ))}
            </select>
          </div>
          
          {"status" in formData && (
            <div className="form-group">
              <label>Contract Status</label>
              <select
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent to Partner</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Requirements Section */}
      <div className="form-card" style={{ marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "16px", fontSize: "16px", color: "var(--primary-color)" }}>📋 Event Requirements</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Number of Meeting Rooms</label>
            <input
              type="number"
              name="meeting_rooms"
              placeholder="e.g. 3"
              value={formData.meeting_rooms || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Seating Style</label>
            <select
              name="seating_style"
              value={formData.seating_style || ""}
              onChange={handleChange}
            >
              <option value="">— Select style —</option>
              <option value="Theater">Theater (Rows of chairs)</option>
              <option value="Classroom">Classroom (Desks & Chairs)</option>
              <option value="Banquet">Banquet (Round tables)</option>
              <option value="U-Shape">U-Shape</option>
              <option value="Boardroom">Boardroom</option>
            </select>
          </div>

          <div className="form-group full-width" style={{ gridColumn: "1 / -1" }}>
            <label>Audio/Visual (AV) Requirements</label>
            <textarea
              rows="3"
              name="av_requirements"
              placeholder="e.g. 2 Projectors, 4 Wireless Mics, Podium..."
              value={formData.av_requirements || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="form-card" style={{ marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "16px", fontSize: "16px", color: "var(--primary-color)" }}>📝 Notes & Revisions</h3>
        <div className="form-grid">
          <div className="form-group full-width" style={{ gridColumn: "1 / -1" }}>
            <label>Revision Notes</label>
            <textarea
              rows="3"
              name="revision_notes"
              placeholder="Any comments, requests from partner, or revision history..."
              value={formData.revision_notes || ""}
              onChange={handleChange}
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