import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { type RickAndMortyCharacter, type SavedCharacter } from "../types";
import { getPersonagemPorId } from "../api/rickAndMortyApi";
import {
  getMeusPersonagens,
  getMeuPersonagemPorId,
  salvarPersonagem,
  editarPersonagem,
  deletarPersonagem,
} from "../api/backendLocal";
import { useAuth } from "../contexts/AuthContext";

export default function DetalhePersonagem() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { estaLogado } = useAuth();

  // descobre a origem pela URL atual
  const veioDeMeusPersonagens =
    location.pathname.startsWith("/meus-personagens");

  // dados do personagem — API ou banco local
  const [personagemApi, setPersonagemApi] =
    useState<RickAndMortyCharacter | null>(null);
  const [personagemLocal, setPersonagemLocal] = useState<SavedCharacter | null>(
    null,
  );

  // se veio da API, guarda aqui a versão salva no banco (se existir)
  const [versaoSalva, setVersaoSalva] = useState<SavedCharacter | null>(null);

  // controle de UI
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // campos editáveis (usados no modo edição)
  const [nomeEdit, setNomeEdit] = useState("");
  const [speciesEdit, setSpeciesEdit] = useState("");
  const [statusEdit, setStatusEdit] = useState("");
  const [originEdit, setOriginEdit] = useState("");
  const [locationEdit, setLocationEdit] = useState("");

  useEffect(() => {
    setCarregando(true);

    if (veioDeMeusPersonagens) {
      // veio de /meus-personagens — carrega do banco local
      getMeuPersonagemPorId(Number(id))
        .then(({ data }) => {
          setPersonagemLocal(data);
          // pré-preenche os campos de edição
          setNomeEdit(data.name);
          setSpeciesEdit(data.species);
          setStatusEdit(data.status);
          setOriginEdit(data.origin);
          setLocationEdit(data.location);
        })
        .catch(() => setErro("Personagem não encontrado"))
        .finally(() => setCarregando(false));
    } else {
      // veio de /personagens — carrega da API externa
      getPersonagemPorId(Number(id))
        .then((data) => {
          setPersonagemApi(data);
          // verifica se esse personagem já foi salvo pelo usuário logado
          if (estaLogado) {
            getMeusPersonagens().then(({ data: salvos }) => {
              const jaExiste = salvos.find(
                (p: SavedCharacter) => p.original_character_id === Number(id),
              );
              if (jaExiste) setVersaoSalva(jaExiste);
            });
          }
        })
        .catch(() => setErro("Personagem não encontrado na API"))
        .finally(() => setCarregando(false));
    }
  }, [id, estaLogado]);

  async function handleSalvar() {
    if (!estaLogado) {
      navigate("/login");
      return;
    }
    if (!personagemApi) return;
    setSalvando(true);
    setErro("");
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
      setSucesso("Personagem salvo com sucesso!");
    } catch (err: any) {
      setErro(err.response?.data?.message || "Erro ao salvar");
    } finally {
      setSalvando(false);
    }
  }

  async function handleEditar() {
    const alvo = versaoSalva || personagemLocal;
    if (!alvo) return;
    setSalvando(true);
    try {
      const { data } = await editarPersonagem(alvo.id, {
        name: nomeEdit,
        species: speciesEdit,
        status: statusEdit,
        origin: originEdit,
        location: locationEdit,
      });
      // atualiza o estado local com os novos dados
      if (veioDeMeusPersonagens) setPersonagemLocal(data);
      else setVersaoSalva(data);
      setModoEdicao(false);
      setSucesso("Personagem atualizado!");
    } catch {
      setErro("Erro ao editar");
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar() {
    const alvo = versaoSalva || personagemLocal;
    if (!alvo) return;
    if (!confirm("Remover este personagem?")) return;
    await deletarPersonagem(alvo.id);
    // volta para a página anterior após deletar
    navigate(veioDeMeusPersonagens ? "/meus-personagens" : "/personagens");
  }

  function entrarModoEdicao() {
    const alvo = versaoSalva || personagemLocal;
    if (!alvo) return;
    setNomeEdit(alvo.name);
    setSpeciesEdit(alvo.species);
    setStatusEdit(alvo.status);
    setOriginEdit(alvo.origin);
    setLocationEdit(alvo.location);
    setSucesso("");
    setModoEdicao(true);
  }

  // dados a exibir — prioriza personagemLocal se veio de /meus-personagens
  const dados = veioDeMeusPersonagens ? personagemLocal : personagemApi;
  // imagem: API tem .image direto, local também
  const imagem = dados?.image || "";

  if (carregando) return <p>Carregando...</p>;
  if (erro && !dados)
    return (
      <div>
        <p>{erro}</p>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    );

  return (
    <main>
      <button onClick={() => navigate(-1)}>← Voltar</button>
      {/* foto + nome */}
      <img
        src={imagem}
        alt={dados?.name}
        style={{ width: 200, borderRadius: 8 }}
      />
      {modoEdicao ? (
        <input value={nomeEdit} onChange={(e) => setNomeEdit(e.target.value)} />
      ) : (
        <h1>{dados?.name}</h1>
      )}
      {/* mensagens de feedback */}
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
      {/* detalhes — modo visualização ou edição */}
      {modoEdicao ? (
        <div>
          <label>
            Espécie
            <input
              value={speciesEdit}
              onChange={(e) => setSpeciesEdit(e.target.value)}
            />
          </label>
          <label>
            Status
            <input
              value={statusEdit}
              onChange={(e) => setStatusEdit(e.target.value)}
            />
          </label>
          <label>
            Origem
            <input
              value={originEdit}
              onChange={(e) => setOriginEdit(e.target.value)}
            />
          </label>
          <label>
            Localização
            <input
              value={locationEdit}
              onChange={(e) => setLocationEdit(e.target.value)}
            />
          </label>
        </div>
      ) : (
        <div>
          {/* personagem da API tem .origin.name, personagem local tem .origin direto */}
          <p>Espécie: {personagemLocal?.species || personagemApi?.species}</p>
          <p>Status: {personagemLocal?.status || personagemApi?.status}</p>
          <p>Gênero: {personagemLocal?.gender || personagemApi?.gender}</p>
          <p>
            Origem: {personagemLocal?.origin || personagemApi?.origin?.name}
          </p>
          <p>
            Localização:{" "}
            {personagemLocal?.location || personagemApi?.location?.name}
          </p>
        </div>
      )}

      {/* botões de ação */}
      <div>
        {modoEdicao ? (
          // modo edição: confirmar ou cancelar
          <>
            <button onClick={handleEditar} disabled={salvando}>
              {salvando ? "Salvando..." : "Confirmar"}
            </button>
            <button onClick={() => setModoEdicao(false)}>Cancelar</button>
          </>
        ) : veioDeMeusPersonagens || versaoSalva ? (
          // personagem já está salvo: editar e excluir
          <>
            <button onClick={entrarModoEdicao}>Editar</button>
            <button onClick={handleDeletar}>Excluir</button>
          </>
        ) : (
          // personagem da API ainda não salvo: botão salvar
          <button onClick={handleSalvar} disabled={salvando}>
            {!estaLogado
              ? "Fazer login para salvar"
              : salvando
                ? "Salvando..."
                : "Salvar personagem"}
          </button>
        )}
      </div>
    </main>
  );
}
