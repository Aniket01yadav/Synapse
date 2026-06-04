import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
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

      await login(formData);

      toast.success(
        "Login successful"
      );

      navigate("/profile");
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#111111] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B]">
            <span className="text-2xl font-bold text-white">
              C
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-zinc-400">
            Sign in to your account
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="Enter your email"
              className="w-full rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none transition-all focus:border-[#8B5CF6]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              placeholder="Enter your password"
              className="w-full rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none transition-all focus:border-[#8B5CF6]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-zinc-400">
          Don't have an
          account?{" "}
          <Link
            to="/register"
            className="font-medium text-[#8B5CF6] hover:text-[#A855F7]"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
