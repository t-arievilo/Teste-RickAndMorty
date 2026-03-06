import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import * as https from "https";

const BASE = "https://rickandmortyapi.com/api";

function httpGet(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          if (res.statusCode === 429) {
            reject({ status: 429 });
            return;
          }
          if (res.statusCode !== 200) {
            reject({ status: res.statusCode });
            return;
          }
          resolve(JSON.parse(data));
        });
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

@Injectable()
export class RickAndMortyService {
  async getPersonagens(page: number, name: string) {
    try {
      let url = `${BASE}/character?page=${page}`;
      if (name) url += `&name=${encodeURIComponent(name)}`;
      return await httpGet(url);
    } catch (err: any) {
      throw new HttpException(err.message || "Erro", err.status || 500);
    }
  }

  async getPersonagemPorId(id: number) {
    try {
      return await httpGet(`${BASE}/character/${id}`);
    } catch (err: any) {
      throw new HttpException(err.message || "Erro", err.status || 500);
    }
  }

  async getEstatisticas() {
    const [personagens, episodios, locais] = await Promise.all([
      httpGet(`${BASE}/character`),
      httpGet(`${BASE}/episode`),
      httpGet(`${BASE}/location`),
    ]);
    return {
      totalPersonagens: personagens.info.count,
      totalEpisodios: episodios.info.count,
      totalLocais: locais.info.count,
    };
  }
}
