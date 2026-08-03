import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from "react";
type User = {
  id: number;
  username: string;
  fotoPerfil: number;
  role: string;
  isProfessional: boolean;
};
type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<
    SetStateAction<boolean>
  >;
  user: User | null;
  setUser: Dispatch<
    SetStateAction<User | null>
  >;
  loadUser: () => Promise<void>;
};
export const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] =
    useState(
      !!localStorage.getItem("token")
    );
  const [user, setUser] =
    useState<User | null>(null);
  async function loadUser() {
    const token =
      localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    const response =
      await fetch(
        "http://localhost:3000/api/users/me",
        {
          headers:{
            Authorization:
              `Bearer ${token}`
          }
        }
      );
    if(response.ok){
      const data =
        await response.json();
      setUser({
        id: data.id,
        username: data.username,
        fotoPerfil: data.fotoPerfil,
        isProfessional: data.isProfessional,
        role: data.role,
      });
    }
  }
  useEffect(()=>{
    if(isAuthenticated){
      loadUser();
    }
  },[isAuthenticated]);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context =
    useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth debe usarse dentro de AuthProvider"
    );
  }
  return context;
}