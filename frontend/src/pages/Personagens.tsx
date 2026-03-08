import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPersonagens } from "../api/rickAndMortyApi";
import { type RickAndMortyCharacter } from "../types";
import CardPersonagem from "../components/CardPersonagem";

type ErroTipo = "nao_encontrado" | "rate_limit" | null;

export default function Personagens() {
  //states de busca
  const [searchParams, setSearchParams] = useSearchParams();
  const pagina = Number(searchParams.get("page")) || 1;
  const busca = searchParams.get("name") || "";

  //states de dados da api
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
      .catch((err: any) =>
        setErro(
          err?.response?.status === 429 ? "rate_limit" : "nao_encontrado",
        ),
      )
      .finally(() => setCarregando(false));
  }
  return (
    <main>
      <h1>Personagens</h1>

      {/* barra de busca */}
      <div>
        <input
          value={inputBusca}
          onChange={(e) => setInputBusca(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && pesquisar()}
          placeholder="Buscar por nome..."
        />
        <button onClick={pesquisar}>Buscar</button>
        {busca && <button onClick={limparBusca}>✕ Limpar</button>}
      </div>

      {/* conteudo principal: loading, erro ou grid */}
      {carregando ? (
        <p>Carregando...</p>
      ) : erro === "rate_limit" ? (
        <div>
          <p>Muitas requisições em pouco tempo</p>
          <p>Aguarde alguns segundos e tente novamente.</p>
          <button onClick={tentarNovamente}>Tentar novamente</button>
        </div>
      ) : erro === "nao_encontrado" ? (
        <div>
          <p>Nenhum personagem encontrado</p>
          <p>Tente buscar por outro nome</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {personagens.map((p) => (
            <CardPersonagem key={p.id} personagem={p} origem="api" />
          ))}
        </div>
      )}
      {/* paginacao — fica visivel mesmo no rate_limit para o usuario saber onde estava */}
      {!carregando && totalPaginas > 1 && erro !== "nao_encontrado" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 32,
            opacity: erro === "rate_limit" ? 0.4 : 1,
            pointerEvents: erro === "rate_limit" ? "none" : "auto",
          }}
        >
          <button disabled={pagina === 1} onClick={() => irParaPagina(1)}>
            «
          </button>
          <button
            disabled={pagina === 1}
            onClick={() => irParaPagina(pagina - 1)}
          >
            Anterior
          </button>

          <span>
            {pagina} / {totalPaginas}
          </span>

          <button
            disabled={pagina === totalPaginas}
            onClick={() => irParaPagina(pagina + 1)}
          >
            Próxima
          </button>
          <button
            disabled={pagina === totalPaginas}
            onClick={() => irParaPagina(totalPaginas)}
          >
            »
          </button>
        </div>
      )}
    </main>
  );
}
