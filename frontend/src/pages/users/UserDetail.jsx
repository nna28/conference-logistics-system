import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import userService from "../../services/userService";

export default function UserDetail() {
  const { id } = useParams();

  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data =
        await userService.getById(id);

      setUser(data);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <BackButton />

      <PageHeader
        title={user.full_name}
        subtitle="User Detail"
      />

      <div className="detail-card">

        <p>
          <strong>ID:</strong>{" "}
          {user.id}
        </p>

        <p>
          <strong>Full Name:</strong>{" "}
          {user.full_name}
        </p>

        <p>
          <strong>Username:</strong>{" "}
          {user.username}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {user.email}
        </p>

        <p>
          <strong>Role:</strong>{" "}
          {user.role}
        </p>

      </div>
    </>
  );
}