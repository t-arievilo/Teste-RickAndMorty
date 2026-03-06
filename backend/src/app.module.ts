import "reflect-metadata";
import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { CharactersModule } from "./characters/characters.module";
import { RickAndMortyModule } from "./integrations/RickAndMortyApi.module";

@Module({ imports: [AuthModule, CharactersModule, RickAndMortyModule] })
export class AppModule {}
