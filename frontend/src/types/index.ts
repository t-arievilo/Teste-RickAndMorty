// tipos da API do Rick and Morty
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

// personagem salvo no nosso banco
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

// usuario logado
export interface AuthUser {
  token: string;
  name: string;
  email: string;
}
