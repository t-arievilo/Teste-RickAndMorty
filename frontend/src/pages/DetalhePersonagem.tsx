import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { getPersonagemPorId } from "../api/rickAndMortyApi";
import {
  getMeusPersonagens,
  getMeuPersonagemPorId,
  salvarPersonagem,
  editarPersonagem,
  deletarPersonagem,
} from "../api/backendLocal";
import { useAuth } from "../contexts/AuthContext";
import { type RickAndMortyCharacter, type SavedCharacter } from "../types";

interface DadosEdicao {
  name: string;
  species: string;
  gender: string;
  origin: string;
  location: string;
  status: string;
}

export default function DetalhePersonagem() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { estaLogado } = useAuth();

  // verifica se veio de "meus personagens" ou da lista geral
  const veioDeMeusPersonagens =
    location.pathname.startsWith("/meus-personagens");

  const [personagemApi, setPersonagemApi] =
    useState<RickAndMortyCharacter | null>(null);
  const [personagemLocal, setPersonagemLocal] = useState<SavedCharacter | null>(
    null,
  );
  const [versaoSalva, setVersaoSalva] = useState<SavedCharacter | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState<DadosEdicao>({
    name: "",
    species: "",
    gender: "",
    origin: "",
    location: "",
    status: "",
  });
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState<{
    tipo: "sucesso" | "erro";
    msg: string;
  } | null>(null);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      try {
        if (veioDeMeusPersonagens) {
          const { data } = await getMeuPersonagemPorId(Number(id));
          setPersonagemLocal(data);
        } else {
          const dados = await getPersonagemPorId(Number(id));
          setPersonagemApi(dados);

          // verifica se ja foi salvo (so se estiver logado)
          if (estaLogado) {
            const { data } = await getMeusPersonagens();
            const salvo = data.find(
              (p) => p.original_character_id === Number(id),
            );
            if (salvo) setVersaoSalva(salvo);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [id, veioDeMeusPersonagens, estaLogado]);

  async function handleSalvar() {
    if (!estaLogado) {
      navigate("/login", { state: { de: location } });
      return;
    }

    if (!personagemApi) return;
    setSalvando(true);

    try {
      const { data } = await salvarPersonagem({
        original_character_id: personagemApi.id,
        name: personagemApi.name,
        species: personagemApi.species,
        gender: personagemApi.gender,
        origin: personagemApi.origin.name,
        location: personagemApi.location.name,
        image: personagemApi.image,
        status: personagemApi.status,
      });
      setVersaoSalva(data);
      mostrarFeedback("sucesso", "Personagem salvo com sucesso!");
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setSalvando(false);
    }
  }
  async function handleAtualizar() {
    const alvo = versaoSalva || personagemLocal;
    if (!alvo) return;

    setSalvando(true);
    try {
      const { data } = await editarPersonagem(alvo.id, dadosEdicao);
      if (veioDeMeusPersonagens) setPersonagemLocal(data);
      else setVersaoSalva(data);
      setEditando(false);
      mostrarFeedback("sucesso", "Personagem atualizado!");
    } catch {
      mostrarFeedback("erro", "Erro ao atualizar");
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar() {
    const alvo = versaoSalva || personagemLocal;
    if (!alvo) return;
    if (!confirm("Tem certeza que quer excluir este personagem?")) return;

    try {
      await deletarPersonagem(alvo.id);
      navigate(veioDeMeusPersonagens ? "/meus-personagens" : "/personagens");
    } catch {
      mostrarFeedback("erro", "Erro ao excluir");
    }
  }

  function abrirEdicao() {
    const alvo = versaoSalva || personagemLocal;
    if (!alvo) return;
    setDadosEdicao({
      name: alvo.name,
      species: alvo.species,
      gender: alvo.gender,
      origin: alvo.origin,
      location: alvo.location,
      status: alvo.status,
    });
    setEditando(true);
  }

  function mostrarFeedback(tipo: "sucesso" | "erro", msg: string) {
    setFeedback({ tipo, msg });
    setTimeout(() => setFeedback(null), 3500);
  }

  if (carregando) {
    return (
      <div className="loading-container" style={{ minHeight: "60vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  const personagem = veioDeMeusPersonagens ? personagemLocal : personagemApi;
  if (!personagem) {
    return (
      <main className="pagina">
        <p style={{ color: "var(--texto2)" }}>Personagem não encontrado.</p>
      </main>
    );
  }

  // pega os valores corretos dependendo da origem
  const nome = editando ? dadosEdicao.name : personagem.name;
  const imagem = personagem.image;
  const status = editando ? dadosEdicao.status : personagem.status;
  const especie = editando ? dadosEdicao.species : personagem.species;
  const genero = editando ? dadosEdicao.gender : personagem.gender;
  const origem = editando
    ? dadosEdicao.origin
    : veioDeMeusPersonagens
      ? (personagem as SavedCharacter).origin
      : (personagem as RickAndMortyCharacter).origin.name;
  const localizacao = editando
    ? dadosEdicao.location
    : veioDeMeusPersonagens
      ? (personagem as SavedCharacter).location
      : (personagem as RickAndMortyCharacter).location.name;

  const statusCls =
    status?.toLowerCase() === "alive"
      ? "status-vivo"
      : status?.toLowerCase() === "dead"
        ? "status-morto"
        : "status-desconhecido";

  const statusLabel =
    status?.toLowerCase() === "alive"
      ? "Vivo"
      : status?.toLowerCase() === "dead"
        ? "Morto"
        : "Desconhecido";

  return (
    <main className="pagina" style={{ maxWidth: 900 }}>
      {/* breadcrumb */}
      <div
        style={{
          display: "flex",
          gap: 8,
          color: "var(--texto3)",
          fontSize: "0.85rem",
          marginBottom: 32,
        }}
      >
        <Link to="/" style={{ color: "var(--texto3)" }}>
          Home
        </Link>
        <span>/</span>
        <Link
          to={veioDeMeusPersonagens ? "/meus-personagens" : "/personagens"}
          style={{ color: "var(--texto3)" }}
        >
          {veioDeMeusPersonagens ? "Meus Personagens" : "Personagens"}
        </Link>
        <span>/</span>
        <span style={{ color: "var(--texto2)" }}>{personagem.name}</span>
      </div>

      {/* feedback */}
      {feedback && (
        <div
          className={feedback.tipo === "sucesso" ? "msg-sucesso" : "msg-erro"}
        >
          {feedback.msg}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(240px, 300px) 1fr",
          gap: 36,
          alignItems: "start",
        }}
      >
        {/* coluna esquerda: foto + acoes */}
        <div>
          <div
            style={{
              borderRadius: "var(--raio)",
              overflow: "hidden",
              border: "2px solid var(--borda2)",
              marginBottom: 14,
              position: "relative",
            }}
          >
            <img
              src={imagem}
              alt={nome}
              style={{ width: "100%", display: "block" }}
            />
            <div style={{ position: "absolute", bottom: 12, left: 12 }}>
              <span className={`status ${statusCls}`}>{statusLabel}</span>
            </div>
          </div>

          {/* botao salvar — so aparece se veio da api e ainda nao foi salvo */}
          {!veioDeMeusPersonagens && !versaoSalva && (
            <button
              onClick={handleSalvar}
              disabled={salvando}
              className="btn btn-verde"
              style={{ width: "100%", marginBottom: 8 }}
            >
              {salvando ? "Salvando..." : "Salvar Personagem"}
            </button>
          )}

          {/* botoes editar/excluir — quando ja esta salvo */}
          {(versaoSalva || veioDeMeusPersonagens) && !editando && (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={abrirEdicao}
                className="btn btn-azul"
                style={{ flex: 1 }}
              >
                Editar
              </button>
              <button
                onClick={handleDeletar}
                className="btn btn-vermelho"
                style={{ flex: 1 }}
              >
                Excluir
              </button>
            </div>
          )}

          {/* aviso de ja salvo */}
          {!veioDeMeusPersonagens && versaoSalva && !editando && (
            <p
              style={{
                textAlign: "center",
                color: "var(--verde)",
                fontSize: "0.82rem",
                marginTop: 10,
                fontWeight: 600,
              }}
            >
              Salvo na sua coleção
            </p>
          )}
        </div>

        {/* coluna direita: informacoes */}
        <div>
          <h1
            style={{
              fontFamily: "var(--font-titulo)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "0.05em",
              lineHeight: 1.1,
              marginBottom: 28,
            }}
          >
            {nome}
          </h1>

          {!editando ? (
            /* modo visualizacao */
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--borda)",
                borderRadius: "var(--raio)",
                overflow: "hidden",
              }}
            >
              {[
                { label: "Espécie", valor: especie },
                { label: "Gênero", valor: genero },
                { label: "Origem", valor: origem },
                { label: "Localização", valor: localizacao },
                ...(veioDeMeusPersonagens && personagemLocal?.created_at
                  ? [
                      {
                        label: "Salvo em",
                        valor: new Date(
                          personagemLocal.created_at,
                        ).toLocaleDateString("pt-BR"),
                      },
                    ]
                  : []),
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "13px 20px",
                    borderBottom: i < 3 ? "1px solid var(--borda)" : "none",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      color: "var(--texto3)",
                      fontSize: "0.82rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      textAlign: "right",
                      color: "var(--texto)",
                    }}
                  >
                    {item.valor || "—"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* modo edicao */
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(0,197,227,0.3)",
                borderRadius: "var(--raio)",
                padding: 20,
              }}
            >
              <p
                style={{
                  color: "var(--azul)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 16,
                }}
              >
                Editando personagem
              </p>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {[
                  { campo: "name", label: "Nome" },
                  { campo: "species", label: "Espécie" },
                  { campo: "gender", label: "Gênero" },
                  { campo: "origin", label: "Origem" },
                  { campo: "location", label: "Localização" },
                  { campo: "status", label: "Status" },
                ].map(({ campo, label }) => (
                  <div key={campo}>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--texto3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 5,
                        display: "block",
                      }}
                    >
                      {label}
                    </label>
                    <input
                      value={dadosEdicao[campo as keyof DadosEdicao] || ""}
                      onChange={(e) =>
                        setDadosEdicao((prev) => ({
                          ...prev,
                          [campo]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button
                  onClick={handleAtualizar}
                  disabled={salvando}
                  className="btn btn-verde"
                  style={{ flex: 1 }}
                >
                  {salvando ? "Salvando..." : " Salvar alterações"}
                </button>
                <button
                  onClick={() => setEditando(false)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
