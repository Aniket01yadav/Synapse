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

  const desktopMenuRef = useRef(null);
  const mobileDrawerRef = useRef(null);
  const mobileAvatarRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!showUserMenu) return;

    const handlePointerDown = (event) => {
      const clickedDesktopMenu =
        desktopMenuRef.current?.contains(event.target);
      const clickedMobileDrawer =
        mobileDrawerRef.current?.contains(event.target);
      const clickedMobileAvatar =
        mobileAvatarRef.current?.contains(event.target);

      if (
        !clickedDesktopMenu &&
        !clickedMobileDrawer &&
        !clickedMobileAvatar
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

  const closeAccountMenu = () => {
    setShowUserMenu(false);
    setShowUpdateForm(false);
  };

  const handleLogout = () => {
    closeAccountMenu();
    logout();
    navigate("/login");
  };

  const handleUserUpdate = async () => {
    await getCurrentUser();
    closeAccountMenu();
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
      closeAccountMenu();
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
      ? "inline-flex items-center justify-center rounded-lg bg-[#8B5CF6] px-3 py-2 text-sm font-medium text-white transition-all"
      : "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-all hover:bg-[#18181B] hover:text-white";

  const bottomNavLinkStyles = ({ isActive }) =>
    isActive
      ? "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl bg-[#8B5CF6] px-2 py-2.5 text-center text-[11px] font-semibold text-white shadow-lg shadow-[#8B5CF6]/25 transition"
      : "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-center text-[11px] font-semibold text-zinc-400 transition hover:bg-[#18181B] hover:text-white";

  const navItems = [
    {
      to: "/profile",
      label: "Profile",
      icon: (
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0" />
      ),
    },
    {
      to: "/network",
      label: "Network",
      icon: (
        <>
          <path d="M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM5 15a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM19 15a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
          <path d="m10 10-3.2 5.4M14 10l3.2 5.4" />
        </>
      ),
    },
    {
      to: "/recommendations",
      label: "Recommendations",
      icon: (
        <path d="M12 3 14.7 8.5l6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
      ),
    },
  ];

  const renderIcon = (icon) => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      {icon}
    </svg>
  );

  const renderAccountActions = () => (
    <>
      <button
        type="button"
        onClick={() =>
          setShowUpdateForm(
            (open) => !open
          )
        }
        className="w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-white transition hover:bg-[#27272A]"
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
        className="mt-2 w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-red-400 transition hover:bg-red-500 hover:text-white"
      >
        Logout
      </button>

      <button
        type="button"
        onClick={openDeleteConfirm}
        disabled={deleting}
        className="mt-2 w-full rounded-lg border border-red-500 px-3 py-3 text-left text-sm font-medium text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting
          ? "Deleting..."
          : "Delete Account"}
      </button>
    </>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800 bg-[#0A0A0A]/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex min-h-10 items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-white">
              {user?.username || "Profile"}
            </h1>
          </div>

          <button
            ref={mobileAvatarRef}
            type="button"
            aria-label="Open account drawer"
            aria-expanded={showUserMenu}
            onClick={() =>
              setShowUserMenu(
                (open) => !open
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B] text-sm font-bold text-white transition ring-[#8B5CF6]/40 hover:ring-4"
          >
            {user?.username?.charAt(0)?.toUpperCase()}
          </button>
        </div>
      </header>

      <div className="h-[65px] lg:hidden" />

      <nav className="sticky top-0 z-50 hidden border-b border-zinc-800 bg-[#0A0A0A]/90 backdrop-blur-md lg:block">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-6 py-3">
          <Link
            to="/profile"
            className="flex min-w-0 items-center gap-3"
          >
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-white">
                Syanpse
              </h1>

              <p className="truncate text-xs text-zinc-500">
                Social Network
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-6">
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
            <div className="text-right">
              <h3 className="text-sm font-medium text-white">
                {user?.username}
              </h3>
            </div>

            <div
              ref={desktopMenuRef}
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
                  {renderAccountActions()}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 lg:hidden ${
          showUserMenu
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeAccountMenu}
        aria-hidden="true"
      />

      <aside
        ref={mobileDrawerRef}
        className={`fixed right-0 top-0 z-50 flex h-dvh w-[min(22rem,88vw)] flex-col border-l border-zinc-800 bg-[#111111] p-4 shadow-2xl shadow-black/50 transition-transform duration-300 ease-out lg:hidden ${
          showUserMenu
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-white">
              {user?.username}
            </h2>
            <p className="text-sm text-zinc-500">
              Account
            </p>
          </div>

          <button
            type="button"
            aria-label="Close account drawer"
            onClick={closeAccountMenu}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 transition hover:bg-[#18181B] hover:text-white"
          >
            <span className="text-xl leading-none">x</span>
          </button>
        </div>

        {renderAccountActions()}
      </aside>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
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

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-[#0A0A0A]/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-2xl shadow-black/50 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={bottomNavLinkStyles}
            >
              {renderIcon(item.icon)}
              <span className="truncate">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
