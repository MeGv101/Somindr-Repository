import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

type Admin = {
  id: number;
  nombre: string;
  role: string;
};

type AuthContextType = {
  user: Admin | null;
  loading: boolean;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [user, setUser] =
    useState<Admin | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {

    const token =
      localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {

      const response =
        await fetch(
          "/api/admin/me",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (!response.ok) {
        throw new Error();
      }

      const data =
        await response.json();

      setUser(data);

    } catch {

      localStorage.removeItem("token");

      setUser(null);

    } finally {

      setLoading(false);

    }

  }

  async function login(
    token: string
  ) {

    localStorage.setItem(
      "token",
      token
    );

    try {

      const response =
        await fetch(
          "/api/admin/me",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (!response.ok) {
        throw new Error();
      }

      const data =
        await response.json();

      setUser(data);

      return true;

    } catch {

      localStorage.removeItem("token");

      setUser(null);

      return false;

    }

  }

  function logout() {

    localStorage.removeItem(
      "token"
    );

    setUser(null);

  }

  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export function useAuth() {
  return useContext(
    AuthContext
  );
}