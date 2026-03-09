import { useEffect, useState } from "react";
import { getMeusPersonagens, deletarPersonagem } from "../api/backendLocal";
import { type SavedCharacter } from "../types";
import CardPersonagem from "../components/CardPersonagem";

export default function MeusPersonagens() {
  const [personagens, setPersonagens] = useState<SavedCharacter[]>([]);

  useEffect(() => {
    getMeusPersonagens().then(({ data }) => setPersonagens(data));
  }, []);

  async function handleDeletar(id: number) {
    await deletarPersonagem(id);
    setPersonagens((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      {personagens.map((pers) => (
        <CardPersonagem
          key={pers.id}
          personagem={pers}
          origem="local"
          onDeletar={handleDeletar}
        />
      ))}
    </div>
  );
}
