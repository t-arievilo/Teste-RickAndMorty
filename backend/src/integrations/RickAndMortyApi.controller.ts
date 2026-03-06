import { Controller, Get, Param, Query } from "@nestjs/common";
import { RickAndMortyService } from "./RickAndMortyApi.service";

@Controller("rickmorty")
export class RickAndMortyController {
  constructor(private rickAndMortyService: RickAndMortyService) {}

  @Get("character")
  getPersonagens(@Query("page") page: string, @Query("name") name: string) {
    return this.rickAndMortyService.getPersonagens(
      Number(page) || 1,
      name || "",
    );
  }

  @Get("character/:id")
  getPersonagemPorId(@Param("id") id: string) {
    return this.rickAndMortyService.getPersonagemPorId(Number(id));
  }

  @Get("stats")
  getEstatisticas() {
    return this.rickAndMortyService.getEstatisticas();
  }
}
