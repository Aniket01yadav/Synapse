import {
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import UserForm from "./UserForm";
import api from "../services/api";

const Navbar = () => {
  const { user, logout, getCurrentUser } = useAuth();
  const [showUserMenu, setShowUserMenu] =
    useState(false);
  const [showUpdateForm, setShowUpdateForm] =
    useState(false);
  const [deleting, setDeleting] =
    useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const userMenuRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!showUserMenu) return;

    const handlePointerDown = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
        setShowUpdateForm(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowUserMenu(false);
        setShowUpdateForm(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUserUpdate = async () => {
    await getCurrentUser();
    setShowUpdateForm(false);
    setShowUserMenu(false);
  };

  const openDeleteConfirm = async () => {
    try {
      setDeleting(true);

      const profileResponse =
        await api.get(
          `/users/${user._id}`
        );

      if (
        profileResponse.data?.friends
          ?.length > 0
      ) {
        toast.error(
          "First unlink all friends before deleting your account"
        );
        return;
      }

      setShowDeleteConfirm(true);
      setShowUserMenu(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unlink all friends before deleting your account"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);

      await api.delete(
        `/users/${user._id}`
      );

      toast.success(
        "Account deleted"
      );
      setShowDeleteConfirm(false);
      logout();
      navigate("/register");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unlink all friends before deleting your account"
      );
    } finally {
      setDeleting(false);
    }
  };

  const navLinkStyles = ({ isActive }) =>
    isActive
      ? "text-white bg-[#8B5CF6] px-4 py-2 rounded-lg transition-all"
      : "text-zinc-400 hover:text-white transition-all";

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-[#0A0A0A]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          to="/profile"
          className="flex items-center gap-3"
        >
          <div>
            <h1 className="text-lg font-bold text-white">
              Syanpse
            </h1>

            <p className="text-xs text-zinc-500">
              Social Network
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink
            to="/profile"
            className={navLinkStyles}
          >
            Profile
          </NavLink>

          <NavLink
            to="/network"
            className={navLinkStyles}
          >
            Network
          </NavLink>

          <NavLink
            to="/recommendations"
            className={navLinkStyles}
          >
            Recommendations
          </NavLink>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <h3 className="text-sm font-medium text-white">
              {user?.username}
            </h3>
          </div>

          <div
            ref={userMenuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setShowUserMenu(
                  (open) => !open
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B] text-sm font-bold text-white transition ring-[#8B5CF6]/40 hover:ring-4"
            >
              {user?.username?.charAt(0)?.toUpperCase()}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-zinc-800 bg-[#18181B] p-3 shadow-2xl">
                <button
                  type="button"
                  onClick={() =>
                    setShowUpdateForm(
                      (open) => !open
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-white transition hover:bg-[#27272A]"
                >
                  Update User
                </button>

                {showUpdateForm && (
                  <div className="mt-3 border-t border-zinc-700 pt-3">
                    <UserForm
                      user={user}
                      onSuccess={
                        handleUserUpdate
                      }
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-400 transition hover:bg-red-500 hover:text-white"
                >
                  Logout
                </button>

                <button
                  type="button"
                  onClick={openDeleteConfirm}
                  disabled={deleting}
                  className="mt-2 w-full rounded-lg border border-red-500 px-3 py-2 text-left text-sm font-medium text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting
                    ? "Deleting..."
                    : "Delete Account"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#111111] p-6 shadow-2xl shadow-black/40">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-xl font-bold text-red-300">
                !
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  Delete account?
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  This permanently deletes your account and cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="rounded-xl border border-zinc-700 px-5 py-2.5 font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="rounded-xl bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 border-t border-zinc-800 py-3 md:hidden">
        <NavLink
          to="/profile"
          className={navLinkStyles}
        >
          Profile
        </NavLink>

        <NavLink
          to="/network"
          className={navLinkStyles}
        >
          Network
        </NavLink>

        <NavLink
          to="/recommendations"
          className={navLinkStyles}
        >
          Recommendations
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
