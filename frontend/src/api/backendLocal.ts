import api from "./axiosInstancia";
import {
  type SavedCharacter,
  type CreateCharacterDto,
  type UpdateCharacterDto,
} from "../types";

export const cadastrar = (dados: {
  name: string;
  email: string;
  password: string;
}) => api.post("/auth/register", dados);

export const entrar = (dados: { email: string; password: string }) =>
  api.post("/auth/login", dados);

export const getMeusPersonagens = () =>
  api.get<SavedCharacter[]>("/characters");

export const getMeuPersonagemPorId = (id: number) =>
  api.get<SavedCharacter>(`/characters/${id}`);

export const salvarPersonagem = (dados: CreateCharacterDto) =>
  api.post<SavedCharacter>("/characters", dados);

export const editarPersonagem = (id: number, dados: UpdateCharacterDto) =>
  api.put<SavedCharacter>(`/characters/${id}`, dados);

export const deletarPersonagem = (id: number) =>
  api.delete(`/characters/${id}`);
