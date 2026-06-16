import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useModal } from "../context/modelContext";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({
  children,
}: Props) {
  const { isAuthenticated } = useAuth();
  const { setAuthMessage } = useModal();

  if (!isAuthenticated) {
    setAuthMessage(
      "Debes iniciar sesión"
    );

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <>{children}</>;
}