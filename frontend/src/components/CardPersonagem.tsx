import { useNavigate } from "react-router-dom";
import { type RickAndMortyCharacter, type SavedCharacter } from "../types";

interface Props {
  personagem: RickAndMortyCharacter | SavedCharacter;
  origem: "api" | "local";
  onDeletar?: (id: number) => void;
}

export default function CardPersonagem({
  personagem,
  origem,
  onDeletar,
}: Props) {
  const navigate = useNavigate();

  function handleClick() {
    if (origem === "api") {
      navigate(`/personagens/${(personagem as RickAndMortyCharacter).id}`);
    } else {
      navigate(`/meus-personagens/${(personagem as SavedCharacter).id}`);
    }
  }

  return (
    <div onClick={handleClick}>
      <img src={personagem.image} alt={personagem.name} />
      <h3>{personagem.name}</h3>
      <p>
        {personagem.status} — {personagem.species}
      </p>
      {onDeletar && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeletar((personagem as SavedCharacter).id);
          }}
        >
          Excluir
        </button>
      )}
    </div>
  );
}
