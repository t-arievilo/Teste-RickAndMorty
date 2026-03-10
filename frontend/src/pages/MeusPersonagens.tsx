import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMeusPersonagens, deletarPersonagem } from "../api/backendLocal";
import { type SavedCharacter } from "../types";
import CardPersonagem from "../components/CardPersonagem";
import RickAndMortyIcone from "../assets/rickAndMortyIcone.png";

export default function MeusPersonagens() {
  const [personagens, setPersonagens] = useState<SavedCharacter[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    getMeusPersonagens()
      .then(({ data }) => setPersonagens(data))
      .finally(() => setCarregando(false));
  }, []);

  async function handleDeletar(id: number) {
    if (
      !confirm("Tem certeza que quer remover este personagem da sua coleção?")
    )
      return;

    await deletarPersonagem(id);
    setPersonagens((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <main className="pagina">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 36,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1 className="titulo-pagina">Meus Personagens</h1>
          <p className="subtitulo-pagina">
            {personagens.length > 0
              ? `${personagens.length} personagem${personagens.length > 1 ? "s" : ""} salvo${personagens.length > 1 ? "s" : ""}`
              : "Sua coleção pessoal"}
          </p>
        </div>
        <Link
          to="/personagens"
          className="btn btn-verde"
          style={{ alignSelf: "center" }}
        >
          + Adicionar mais
        </Link>
      </div>

      {carregando ? (
        <div className="loading-container">
          <div className="spinner" />
        </div>
      ) : personagens.length === 0 ? (
        <div className="vazio">
          <img
            src={RickAndMortyIcone}
            alt="Rick e Morty"
            style={{
              width: "120px",
              height: "auto",
              marginBottom: "16px",
              filter: "drop-shadow(0 0 10px rgba(0, 197, 227, 0.3))",
            }}
          />
          <p className="vazio-texto">Sua coleção está vazia</p>
          <p
            style={{
              color: "var(--texto3)",
              fontSize: "0.9rem",
              marginTop: 4,
              marginBottom: 20,
            }}
          >
            Salve personagens para vê-los aqui
          </p>
          <Link
            to="/personagens"
            className="btn btn-verde"
            style={{ display: "inline-flex" }}
          >
            Explorar personagens
          </Link>
        </div>
      ) : (
        <div className="grid-cards">
          {personagens.map((p) => (
            <CardPersonagem
              key={p.id}
              personagem={p}
              origem="local"
              onDeletar={handleDeletar}
            />
          ))}
        </div>
      )}
    </main>
  );
}
