import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { estaLogado, usuario, deslogar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleSair() {
    deslogar();
    navigate("/login");
  }

  function ativo(caminho: string) {
    return location.pathname === caminho;
  }

  return (
    <nav
      style={{
        background: "rgba(9, 13, 26, 0.96)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--borda)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 62,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* logo */}
        <Link to="/">
          <span
            style={{
              fontFamily: "var(--font-rick)",
              fontSize: "1.5rem",
              letterSpacing: "0.06em",
              background: "linear-gradient(90deg, var(--verde), var(--azul))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Rick and Morty
          </span>
        </Link>

        {/* links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { href: "/", label: "Home" },
            { href: "/personagens", label: "Personagens" },
            ...(estaLogado
              ? [{ href: "/meus-personagens", label: "Meus Personagens" }]
              : []),
          ].map((link) => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: "0.88rem",
                fontWeight: 600,
                color: ativo(link.href) ? "var(--verde)" : "var(--texto2)",
                background: ativo(link.href)
                  ? "var(--verde-dim)"
                  : "transparent",
                border: `1px solid ${ativo(link.href) ? "rgba(57,255,20,0.2)" : "transparent"}`,
                transition: "var(--transicao)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* area de usuario */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {estaLogado ? (
            <>
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--texto2)",
                  padding: "4px 12px",
                  background: "var(--bg-card)",
                  borderRadius: 20,
                  border: "1px solid var(--borda)",
                }}
              >
                {usuario?.name}
              </span>
              <button
                onClick={handleSair}
                className="btn btn-vermelho"
                style={{ padding: "6px 14px", fontSize: "0.85rem" }}
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn btn-verde"
              style={{ padding: "7px 18px" }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
