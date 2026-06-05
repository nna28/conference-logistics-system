import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../../components/layout/BackButton";
import PageHeader from "../../components/layout/PageHeader";

import UserForm from "../../components/user/UserForm";

import userService from "../../services/userService";

export default function UserCreate() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    password: "",
    role: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await userService.create(formData);

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
        title="Create User"
        subtitle="Create a new user"
      />

      <UserForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitLabel="Create User"
        loading={loading}
      />
    </>
  );
}