import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3001/api/rickmorty" });

type CharacterParams = {
  page: number;
  name?: string;
};

export async function getPersonagens(pagina: number, nome: string) {
  const params: CharacterParams = { page: pagina };
  if (nome) params.name = nome;
  const { data } = await api.get("/character", { params });
  return data;
}

export async function getPersonagemPorId(id: number) {
  const { data } = await api.get(`/character/${id}`);
  return data;
}

export async function getEstatisticas() {
  const { data } = await api.get("/stats");
  return data;
}
