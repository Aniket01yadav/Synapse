import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Network from "./pages/Network";
import Recommendations from "./pages/Recommendations";

import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/home"
          element={<Navigate to="/profile" replace />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/network"
          element={
            <ProtectedRoute>
              <Network />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<Navigate to="/profile" replace />}
        />

        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
              <h1 className="text-3xl font-bold text-white">
                404 - Page Not Found
              </h1>
            </div>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
