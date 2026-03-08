import { useNavigate } from "react-router-dom";
import { type RickAndMortyCharacter } from "../types";

interface Props {
  personagem: RickAndMortyCharacter;
  origem: "api" | "local";
}

export default function CardPersonagem({ personagem }: Props) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/personagens/${(personagem as RickAndMortyCharacter).id}`);
  }

  return (
    <div onClick={handleClick}>
      <img src={personagem.image} alt={personagem.name} />
      <h3>{personagem.name}</h3>
      <p>
        {personagem.status} — {personagem.species}
      </p>
      <button>Excluir</button>
    </div>
  );
}
