// ─── Rick and Morty API ───────────────────────────────────────────────────────

export interface RickAndMortyCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: { name: string };
  location: { name: string };
  image: string;
}

export interface RickAndMortyApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: RickAndMortyCharacter[];
}

/** Parâmetros aceitos pela rota GET /character da API */
export interface CharacterParams {
  page: number;
  name?: string;
}

// ─── Banco local ──────────────────────────────────────────────────────────────

/** Personagem salvo no banco SQLite do usuário */
export interface SavedCharacter {
  id: number;
  original_character_id: number;
  name: string;
  species: string;
  gender: string;
  origin: string;
  location: string;
  image: string;
  status: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

/** Payload para criar um personagem no banco */
export interface CreateCharacterDto {
  original_character_id: number;
  name: string;
  species: string;
  gender: string;
  origin: string;
  location: string;
  image: string;
  status: string;
}

/** Payload para editar um personagem (todos os campos opcionais) */
export type UpdateCharacterDto = Partial<CreateCharacterDto>;

/** Campos editáveis na tela de detalhe */
export interface DadosEdicao {
  name: string;
  species: string;
  gender: string;
  origin: string;
  location: string;
  status: string;
}

// ─── Autenticação ─────────────────────────────────────────────────────────────

/** Usuário logado (retornado pelo backend no login/register) */
export interface AuthUser {
  token: string;
  name: string;
  email: string;
}

/** Shape do contexto de autenticação */
export interface AuthContextType {
  usuario: AuthUser | null;
  logar: (user: AuthUser) => void;
  deslogar: () => void;
  estaLogado: boolean;
}

// ─── UI / páginas ─────────────────────────────────────────────────────────────

/** Estatísticas retornadas por GET /rickmorty/stats */
export interface Estatisticas {
  totalPersonagens: number;
  totalEpisodios: number;
  totalLocais: number;
}

/** State injetado pelo React Router ao redirecionar para /login */
export interface LocationState {
  de?: {
    pathname: string;
  };
}

/** Tipos de erro na página de listagem de personagens */
export type ErroTipo = "nao_encontrado" | "rate_limit" | null;

/** Parâmetros de URL usados na página de listagem (useSearchParams) */
export interface SearchParamsObj {
  page: string;
  name?: string;
}
