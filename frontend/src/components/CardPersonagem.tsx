import { useNavigate } from "react-router-dom";
import { type RickAndMortyCharacter, type SavedCharacter } from "../types";

interface Props {
  personagem: RickAndMortyCharacter | SavedCharacter;
  origem: "api" | "local";
  onDeletar?: (id: number) => void;
}

function getStatusClass(status: string) {
  const stats = status?.toLowerCase();
  if (stats === "alive") return { classe: "status-vivo", label: "Vivo" };
  if (stats === "dead") return { classe: "status-morto", label: "Morto" };
  return { classe: "status-desconhecido", label: "Desconhecido" };
}

export default function CardPersonagem({
  personagem,
  origem,
  onDeletar,
}: Props) {
  const navigate = useNavigate();
  const { classe, label } = getStatusClass(personagem.status);

  function handleClick() {
    if (origem === "api") {
      navigate(`/personagens/${(personagem as RickAndMortyCharacter).id}`);
    } else {
      navigate(`/meus-personagens/${(personagem as SavedCharacter).id}`);
    }
  }

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--borda)",
        borderRadius: "var(--raio)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "var(--transicao)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(57,255,20,0.3)";
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "var(--sombra-verde)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--borda)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* imagem */}
      <div onClick={handleClick} style={{ position: "relative" }}>
        <img
          src={personagem.image}
          alt={personagem.name}
          style={{
            width: "100%",
            aspectRatio: "1",
            objectFit: "cover",
            display: "block",
          }}
        />
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <span className={`status ${classe}`}>{label}</span>
        </div>
      </div>

      {/* info */}
      <div onClick={handleClick} style={{ padding: "12px 14px" }}>
        <h3
          style={{
            fontFamily: "var(--font-titulo)",
            fontSize: "1.1rem",
            letterSpacing: "0.04em",
            marginBottom: 3,
            lineHeight: 1.2,
          }}
        >
          {personagem.name}
        </h3>
        <p style={{ fontSize: "0.8rem", color: "var(--texto2)" }}>
          {personagem.species}
        </p>
      </div>

      {/* botao deletar que so aparece em meus personagens */}
      {onDeletar && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeletar((personagem as SavedCharacter).id);
          }}
          className="btn btn-vermelho"
          style={{
            width: "100%",
            borderRadius: 0,
            borderTop: "1px solid var(--borda)",
            padding: "9px",
            fontSize: "0.82rem",
          }}
        >
          Excluir
        </button>
      )}
    </div>
  );
}
