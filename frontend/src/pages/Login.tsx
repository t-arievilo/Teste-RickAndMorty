import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { cadastrar, entrar } from "../api/backendLocal";

export default function Login() {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { logar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // volta pra pagina de onde veio depois do login
  const destino = (location.state as any)?.de?.pathname || "/";

  async function handleSubmit() {
    setErro("");

    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }

    if (modoCadastro && !nome) {
      setErro("Informe seu nome");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter ao menos 6 caracteres");
      return;
    }

    setCarregando(true);
    try {
      if (modoCadastro) {
        const { data } = await cadastrar({
          name: nome,
          email,
          password: senha,
        });
        logar(data);
      } else {
        const { data } = await entrar({ email, password: senha });
        logar(data);
      }
      navigate(destino, { replace: true });
    } catch (err: any) {
      setErro(
        err.response?.data?.message || "Algo deu errado, tente novamente",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        minHeight: "calc(100vh - 62px)",
      }}
    >
      <div
        style={{ width: "100%", maxWidth: 420, animation: "fadeIn 0.3s ease" }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--borda2)",
            borderRadius: "var(--raio)",
            padding: "40px 36px",
          }}
        >
          {/* header */}
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <h1
              style={{
                fontFamily: "var(--font-titulo)",
                fontSize: "2rem",
                letterSpacing: "0.06em",
                marginBottom: 6,
              }}
            >
              {modoCadastro ? "Criar conta" : "Entrar"}
            </h1>
            <p style={{ color: "var(--texto2)", fontSize: "0.88rem" }}>
              {modoCadastro
                ? "Crie sua conta para salvar personagens"
                : "Entre para acessar sua coleção"}
            </p>
          </div>

          {/* erro */}
          {erro && <div className="msg-erro">{erro}</div>}

          {/* campos */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {modoCadastro && (
              <div>
                <label
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--texto3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Nome
                </label>
                <input
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
            )}

            <div>
              <label
                style={{
                  fontSize: "0.78rem",
                  color: "var(--texto3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: "0.78rem",
                  color: "var(--texto3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Senha
              </label>
              <input
                type="password"
                placeholder={modoCadastro ? "Mínimo 6 caracteres" : "••••••••"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={carregando}
              className="btn btn-verde"
              style={{ width: "100%", marginTop: 4, padding: "13px" }}
            >
              {carregando
                ? "Aguarde..."
                : modoCadastro
                  ? "Criar conta"
                  : "Entrar"}
            </button>
          </div>

          {/* alternar modo */}
          <p
            style={{
              textAlign: "center",
              marginTop: 22,
              color: "var(--texto2)",
              fontSize: "0.88rem",
            }}
          >
            {modoCadastro ? "Já tem conta?" : "Não tem conta?"}{" "}
            <button
              onClick={() => {
                setModoCadastro(!modoCadastro);
                setErro("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--verde-claro-texto)",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
              }}
            >
              {modoCadastro ? "Fazer login" : "Cadastrar"}
            </button>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 18 }}>
          <Link
            to="/personagens"
            style={{ color: "var(--texto3)", fontSize: "0.85rem" }}
          >
            Continuar sem login
          </Link>
        </p>
      </div>
    </div>
  );
}
