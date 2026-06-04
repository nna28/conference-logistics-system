import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/layout/PageHeader";

import userService from "../../services/userService";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data =
        await userService.getAll();

      setUsers(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this user?"
      )
    ) {
      return;
    }

    try {
      await userService.delete(id);

      loadUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Manage users"
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

            {users.map((user) => (
              <tr key={user.id}>

                <td>{user.id}</td>

                <td>
                  {user.full_name}
                </td>

                <td>
                  {user.username}
                </td>

                <td>
                  {user.email}
                </td>

                <td>
                  {user.role}
                </td>

                <td>

                  <Link
                    to={`/users/${user.id}`}
                  >
                    View
                  </Link>

                  {" | "}

                  <Link
                    to={`/users/edit/${user.id}`}
                  >
                    Edit
                  </Link>

                  {" | "}

                  <button
                    onClick={() =>
                      handleDelete(user.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </>
  );
}