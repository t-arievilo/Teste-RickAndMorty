import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { estaLogado, usuario, deslogar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleSair() {
    deslogar();
    navigate("/login");
  }

  function ativo(caminho: string) {
    return location.pathname === caminho;
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/personagens", label: "Personagens" },
    ...(estaLogado
      ? [{ href: "/meus-personagens", label: "Meus Personagens" }]
      : []),
  ];

  return (
    <>
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
            justifyContent: isMobile ? "flex-end" : "space-between",
            gap: 16,
            position: "relative",
          }}
        >
          {/* botão hamburguer */}
          {isMobile && (
            <button
              onClick={() => setMenuAberto(true)}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.6rem",
                color: "white",
                cursor: "pointer",
              }}
            >
              ☰
            </button>
          )}

          {/* logo */}
          <Link
            to="/"
            style={
              isMobile
                ? {
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }
                : {
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                  }
            }
          >
            <span
              style={{
                fontFamily: "var(--font-rick)",
                fontSize: "2rem",
                letterSpacing: "0.06em",
                background: "var(--azul)",
                WebkitTextStroke: "0.4px var(--verde-claro-texto)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                whiteSpace: "nowrap",
              }}
            >
              Rick
            </span>
            <span
              style={{
                fontFamily: "var(--font-rick)",
                fontSize: "1.1rem",
                letterSpacing: "0.06em",
                background: "var(--azul)",
                WebkitTextStroke: "0.4px var(--verde-claro-texto)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                whiteSpace: "nowrap",
              }}
            >
              and
            </span>
            <span
              style={{
                fontFamily: "var(--font-rick)",
                fontSize: "2rem",
                letterSpacing: "0.06em",
                background: "var(--azul)",
                WebkitTextStroke: "0.4px var(--verde-claro-texto)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                whiteSpace: "nowrap",
              }}
            >
              MortY
            </span>
          </Link>

          {/* links desktop */}
          {!isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                flex: 2,
              }}
            >
              {links.map((link) => (
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
                    border: `1px solid ${
                      ativo(link.href) ? "rgba(57,255,20,0.2)" : "transparent"
                    }`,
                    transition: "var(--transicao)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* area usuário desktop */}
          {!isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 10,
                flex: 1,
              }}
            >
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
          )}
        </div>
      </nav>

      {/* overlay */}
      {menuAberto && (
        <div
          onClick={() => setMenuAberto(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 150,
          }}
        />
      )}

      {/* sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 260,
          height: "100vh",
          background: "#0b1020",
          padding: 24,
          zIndex: 200,
          transform: menuAberto ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <button
          onClick={() => setMenuAberto(false)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "1.4rem",
            alignSelf: "flex-end",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={() => setMenuAberto(false)}
            style={{ fontSize: "1.1rem", color: "white" }}
          >
            {link.label}
          </Link>
        ))}

        <hr style={{ borderColor: "#222" }} />

        {estaLogado ? (
          <>
            <span style={{ color: "#aaa" }}>{usuario?.name}</span>
            <button onClick={handleSair} className="btn btn-vermelho">
              Sair
            </button>
          </>
        ) : (
          <Link to="/login" onClick={() => setMenuAberto(false)}>
            Login
          </Link>
        )}
      </div>
    </>
  );
}
