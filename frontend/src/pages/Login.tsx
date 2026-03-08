import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { cadastrar, entrar } from "../api/backendLocal";

export default function Login() {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const { logar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = (location.state as any)?.de?.pathname || "/";

  async function handleSubmit() {
    setErro("");
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
      setErro(err.response?.data?.message || "Algo deu errado");
    }
  }

  return (
    <div>
      <h2>{modoCadastro ? "Criar conta" : "Entrar"}</h2>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {modoCadastro && (
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      )}
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button onClick={handleSubmit}>
        {modoCadastro ? "Cadastrar" : "Entrar"}
      </button>
      <button onClick={() => setModoCadastro(!modoCadastro)}>
        {modoCadastro ? "Já tenho conta" : "Criar conta"}
      </button>
    </div>
  );
}
