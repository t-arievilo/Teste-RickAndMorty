// ─── Users ────────────────────────────────────────────────────────────────────

/** Shape da linha retornada pelo SQLite na tabela users */
export interface UsuarioDB {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

// ─── Characters ───────────────────────────────────────────────────────────────

/** Payload para criar um personagem (vindo do body da requisição) */
export interface CreateCharacterDto {
  original_character_id: number;
  name: string;
  species?: string;
  gender?: string;
  origin?: string;
  location?: string;
  image?: string;
  status?: string;
}

/** Payload para editar um personagem (todos os campos opcionais) */
export type UpdateCharacterDto = Partial<CreateCharacterDto>;

// ─── Rick and Morty API ───────────────────────────────────────────────────────

/** Erro retornado internamente pela função httpGet */
export interface HttpGetError {
  status: number;
  message?: string;
}

/** Resposta da rota /stats */
export interface EstatisticasResponse {
  totalPersonagens: number;
  totalEpisodios: number;
  totalLocais: number;
}
