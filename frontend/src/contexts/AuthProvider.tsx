import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { type AuthUser } from "../types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    if (token && name && email) return { token, name, email };
    return null;
  });

  function logar(user: AuthUser) {
    localStorage.setItem("token", user.token);
    localStorage.setItem("name", user.name);
    localStorage.setItem("email", user.email);
    setUsuario(user);
  }

  function deslogar() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, logar, deslogar, estaLogado: !!usuario }}
    >
      {children}
    </AuthContext.Provider>
  );
}
