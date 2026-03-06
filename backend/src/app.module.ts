import "reflect-metadata";
import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { CharactersModule } from "./characters/characters.module";

@Module({ imports: [AuthModule, CharactersModule] })
export class AppModule {}
