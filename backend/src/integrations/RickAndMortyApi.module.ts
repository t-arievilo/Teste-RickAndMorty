import { Module } from "@nestjs/common";
import { RickAndMortyController } from "./RickAndMortyApi.controller";
import { RickAndMortyService } from "./RickAndMortyApi.service";

@Module({
  controllers: [RickAndMortyController],
  providers: [RickAndMortyService],
})
export class RickAndMortyModule {}
