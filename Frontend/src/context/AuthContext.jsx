import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const register = async (
    formData
  ) => {
    const response =
      await api.post(
        "/auth/register",
        formData
      );

    const {
      token,
      user,
    } = response.data;

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setUser(user);

    return response.data;
  };

  const login = async (
    formData
  ) => {
    const response =
      await api.post(
        "/auth/login",
        formData
      );

    const {
      token,
      user,
    } = response.data;

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setUser(user);

    return response.data;
  };

  const logout = useCallback(() => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setUser(null);
  }, []);

  const getCurrentUser =
    useCallback(async () => {
      try {
        const response =
        await api.get(
          "/auth/me"
        );

        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );

        setUser(response.data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }, [logout]);

  useEffect(() => {
    const token =
      localStorage.getItem(
        "token"
    );

    if (token) {
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, [getCurrentUser]);

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    setUser,
    getCurrentUser,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
