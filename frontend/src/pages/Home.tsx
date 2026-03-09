import { useEffect, useState } from "react";
import { getEstatisticas } from "../api/rickAndMortyApi";
import { getMeusPersonagens } from "../api/backendLocal";
import { useAuth } from "../contexts/AuthContext";
import CardPersonagem from "../components/CardPersonagem";

export default function Home() {
  const { estaLogado } = useAuth();
  const [stats, setStats] = useState(null);
  const [meusPersonagens, setMeusPersonagens] = useState([]);

  useEffect(() => {
    getEstatisticas().then(setStats);
    if (estaLogado) {
      getMeusPersonagens().then(({ data }) => setMeusPersonagens(data));
    }
  }, [estaLogado]);

  const ultimos3 = meusPersonagens.slice(0, 3);

  return (
    <div>
      <p>Personagens: {stats?.totalPersonagens}</p>
      <p>Episódios: {stats?.totalEpisodios}</p>
      <p>Localizações: {stats?.totalLocais}</p>
      {estaLogado && (
        <>
          <p>Meus salvos: {meusPersonagens.length}</p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
              gap: 16,
            }}
          >
            {ultimos3.map((p) => (
              <CardPersonagem key={p.id} personagem={p} origem="local" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
