import { createContext, useContext } from "react";
import { type AuthUser } from "../types";

export interface AuthContextType {
  usuario: AuthUser | null;
  logar: (user: AuthUser) => void;
  deslogar: () => void;
  estaLogado: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
