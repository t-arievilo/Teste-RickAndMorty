import { useEffect, useState } from "react";
import { getEstatisticas } from "../api/rickAndMortyApi";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { estaLogado } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getEstatisticas().then(setStats);
  });

  return (
    <div>
      <p>Personagens: {stats?.totalPersonagens}</p>
      <p>Episódios: {stats?.totalEpisodios}</p>
      <p>Localizações: {stats?.totalLocais}</p>
      {estaLogado && (
        <>
          <p>Meus salvos: </p>
        </>
      )}
    </div>
  );
}
