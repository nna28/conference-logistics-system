import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageHeader from "../../components/layout/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import userService from "../../services/userService";

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await userService.delete(deleteId);
      setDeleteId(null);
      loadUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  const filtered = users.filter((u) =>
    (u.full_name + u.username + u.email)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Manage system users"
        onCreate={() => navigate("/users/new")}
        createLabel="New User"
        showSearch
        searchValue={search}
        onSearch={setSearch}
      />

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id}>
                  <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>#{user.id}</td>
                  <td style={{ fontWeight: 600 }}>{user.full_name}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{user.username}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{user.email}</td>
                  <td>
                    <span className="badge" style={{ background: "var(--blue-light)", color: "var(--blue)" }}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/users/${user.id}`} title="View">👁</Link>
                      <Link to={`/users/edit/${user.id}`} title="Edit">✏️</Link>
                      <button className="delete" onClick={() => setDeleteId(user.id)} title="Delete">🗑</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteModal
        open={!!deleteId}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}