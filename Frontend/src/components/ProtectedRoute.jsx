import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({
  children,
}) => {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-[#8B5CF6] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
