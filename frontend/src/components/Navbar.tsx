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
  const ativo = (path: string) => location.pathname === path;

  return (
    <nav>
      <Link to="/">Rick & Morty</Link>
      <Link to="/personagens">Personagens</Link>
      {estaLogado && <Link to="/meus-personagens">Meus Personagens</Link>}
      {estaLogado ? (
        <>
          <span>{usuario?.name}</span>
          <button onClick={handleSair}>Sair</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
