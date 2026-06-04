import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import UserForm from "../../components/user/UserForm";

import userService from "../../services/userService";

export default function UserEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data =
        await userService.getById(id);

      setFormData({
        ...data,
        password: "",
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await userService.update(
        id,
        formData
      );

      navigate("/users");
    } catch (error) {
      alert(
        error.response?.data?.detail ||
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackButton />

      <PageHeader
        title="Edit User"
        subtitle={`User #${id}`}
      />

      <UserForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        loading={loading}
      />
    </>
  );
}