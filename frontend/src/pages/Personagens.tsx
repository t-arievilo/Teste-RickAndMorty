import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPersonagens } from "../api/rickAndMortyApi";
import { type RickAndMortyCharacter } from "../types";
import CardPersonagem from "../components/CardPersonagem";

type ErroTipo = "nao_encontrado" | "rate_limit" | null;

export default function Personagens() {
  const [searchParams, setSearchParams] = useSearchParams();

  // pagina e busca ficam na URL: /personagens?page=35&name=rick
  // assim quando o usuario clica em voltar, o browser restaura a URL e o estado volta certinho
  const pagina = Number(searchParams.get("page")) || 1;
  const busca = searchParams.get("name") || "";

  const [personagens, setPersonagens] = useState<RickAndMortyCharacter[]>([]);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [inputBusca, setInputBusca] = useState(busca);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<ErroTipo>(null);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro(null);
      try {
        const data = await getPersonagens(pagina, busca);
        setPersonagens(data.results);
        setTotalPaginas(data.info.pages);
      } catch (err: any) {
        setPersonagens([]);
        setErro(
          err?.response?.status === 429 ? "rate_limit" : "nao_encontrado",
        );
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [pagina, busca]);

  function irParaPagina(p: number) {
    const params: any = { page: String(p) };
    if (busca) params.name = busca;
    setSearchParams(params);
  }

  function pesquisar() {
    // ao pesquisar volta para pagina 1
    const params: any = { page: "1" };
    if (inputBusca) params.name = inputBusca;
    setSearchParams(params);
  }

  function limparBusca() {
    setInputBusca("");
    setSearchParams({ page: "1" });
  }

  function tentarNovamente() {
    setErro(null);
    setCarregando(true);
    getPersonagens(pagina, busca)
      .then((data) => {
        setPersonagens(data.results);
        setTotalPaginas(data.info.pages);
      })
      .catch((err: any) => {
        setErro(
          err?.response?.status === 429 ? "rate_limit" : "nao_encontrado",
        );
      })
      .finally(() => setCarregando(false));
  }

  return (
    <main className="pagina">
      <h1 className="titulo-pagina">Personagens</h1>
      <p className="subtitulo-pagina">
        Explore todos os personagens do universo Rick & Morty
      </p>

      {/* barra de busca */}
      <div
        style={{ display: "flex", gap: 10, marginBottom: 32, maxWidth: 500 }}
      >
        <input
          value={inputBusca}
          onChange={(e) => setInputBusca(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && pesquisar()}
          placeholder="Buscar por nome..."
        />
        <button
          onClick={pesquisar}
          className="btn btn-verde"
          style={{ whiteSpace: "nowrap" }}
        >
          Buscar
        </button>
        {busca && (
          <button onClick={limparBusca} className="btn btn-outline">
            ✕
          </button>
        )}
      </div>

      {/* grid ou mensagens */}
      {carregando ? (
        <div className="loading-container">
          <div className="spinner" />
        </div>
      ) : erro === "rate_limit" ? (
        <div className="vazio" style={{ borderColor: "rgba(245,197,24,0.3)" }}>
          <p className="vazio-icone">⏳</p>
          <p className="vazio-texto" style={{ color: "var(--amarelo)" }}>
            Muitas requisições em pouco tempo
          </p>
          <p
            style={{
              color: "var(--texto2)",
              fontSize: "0.9rem",
              marginTop: 6,
              maxWidth: 360,
              margin: "8px auto 0",
            }}
          >
            A API do Rick & Morty limitou as suas requisições. Aguarde alguns
            segundos e tente novamente.
          </p>
          <button
            onClick={tentarNovamente}
            className="btn btn-outline"
            style={{
              marginTop: 20,
              borderColor: "var(--amarelo)",
              color: "var(--amarelo)",
            }}
          >
            Tentar novamente
          </button>
        </div>
      ) : erro === "nao_encontrado" ? (
        <div className="vazio">
          <p className="vazio-icone">🌀</p>
          <p className="vazio-texto">Nenhum personagem encontrado</p>
          <p
            style={{ color: "var(--texto3)", fontSize: "0.9rem", marginTop: 4 }}
          >
            Tente buscar por outro nome
          </p>
        </div>
      ) : (
        <div className="grid-cards">
          {personagens.map((p) => (
            <CardPersonagem key={p.id} personagem={p} origem="api" />
          ))}
        </div>
      )}

      {/* paginacao */}
      {!carregando && totalPaginas > 1 && erro !== "nao_encontrado" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginTop: 40,
            flexWrap: "wrap",
            opacity: erro === "rate_limit" ? 0.4 : 1,
            pointerEvents: erro === "rate_limit" ? "none" : "auto",
          }}
        >
          <button
            disabled={pagina === 1}
            onClick={() => irParaPagina(1)}
            className="btn btn-outline"
            style={{ padding: "8px 12px" }}
          >
            «
          </button>

          <button
            disabled={pagina === 1}
            onClick={() => irParaPagina(pagina - 1)}
            className="btn btn-outline"
          >
            ← Anterior
          </button>

          <span
            style={{
              padding: "9px 20px",
              background: "var(--verde-dim)",
              border: "1px solid rgba(57,255,20,0.2)",
              borderRadius: 8,
              color: "var(--verde)",
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            {pagina} / {totalPaginas}
          </span>

          <button
            disabled={pagina === totalPaginas}
            onClick={() => irParaPagina(pagina + 1)}
            className="btn btn-outline"
          >
            Próxima →
          </button>

          <button
            disabled={pagina === totalPaginas}
            onClick={() => irParaPagina(totalPaginas)}
            className="btn btn-outline"
            style={{ padding: "8px 12px" }}
          >
            »
          </button>
        </div>
      )}
    </main>
  );
}
