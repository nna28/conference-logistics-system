import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import userService from "../../services/userService";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.getById(id).then(setUser).catch(console.error);
  }, [id]);

  if (!user) return null;

  return (
    <>
      <BackButton />

      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div className="page-header-left">
          <p className="page-subtitle">Users</p>
          <h1>{user.full_name}</h1>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline" onClick={() => navigate(`/users/edit/${id}`)}>
            ✏️ Edit
          </button>
        </div>
      </div>

      <div className="detail-card" style={{ maxWidth: "600px" }}>
        <h3>User Information</h3>
        <div className="detail-field">
          <span className="detail-field-label">ID</span>
          <span className="detail-field-value">#{user.id}</span>
        </div>
        <div className="detail-field">
          <span className="detail-field-label">Full Name</span>
          <span className="detail-field-value" style={{ fontWeight: 600 }}>{user.full_name}</span>
        </div>
        <div className="detail-field">
          <span className="detail-field-label">Username</span>
          <span className="detail-field-value">{user.username}</span>
        </div>
        <div className="detail-field">
          <span className="detail-field-label">Email</span>
          <span className="detail-field-value">{user.email}</span>
        </div>
        <div className="detail-field">
          <span className="detail-field-label">Role</span>
          <span className="detail-field-value">
            <span className="badge" style={{ background: "var(--blue-light)", color: "var(--blue)" }}>
              {user.role}
            </span>
          </span>
        </div>
      </div>
    </>
  );
}