import { useState } from "react";
import { toast } from "react-hot-toast";

import api from "../services/api";

const UserForm = ({
  user,
  onSuccess,
}) => {
  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      username:
        user?.username || "",
      age: user?.age || "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (user?._id) {
        await api.put(
          `/users/${user._id}`,
          formData
        );

        toast.success(
          "User updated"
        );
      } else {
        await api.post(
          "/users",
          formData
        );

        toast.success(
          "User created"
        );
      }

      onSuccess?.();
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-4"
    >
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={
          formData.username
        }
        onChange={
          handleChange
        }
        className="w-full rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white"
      />

      <input
        type="number"
        name="age"
        placeholder="Age"
        value={
          formData.age
        }
        onChange={
          handleChange
        }
        className="w-full rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white"
      />

      <button
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] py-3 font-semibold text-white"
      >
        {loading
          ? "Saving..."
          : user?._id
          ? "Update User"
          : "Create User"}
      </button>
    </form>
  );
};

export default UserForm;