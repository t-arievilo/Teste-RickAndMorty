import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { JSX } from "react/jsx-dev-runtime";

export default function RotaPrivada({ children }: { children: JSX.Element }) {
  const { estaLogado } = useAuth();
  const location = useLocation();

  if (!estaLogado) {
    return <Navigate to="/login" state={{ de: location }} replace />;
  }
  return children;
}
