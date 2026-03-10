import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  ParseIntPipe,
  HttpCode,
} from "@nestjs/common";
import { CharactersService } from "./characters.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guards";
import { type CreateCharacterDto, type UpdateCharacterDto } from "../types";

interface RequestComUsuario {
  user: { id: number };
}

// todas as rotas exigem login
@UseGuards(JwtAuthGuard)
@Controller("characters")
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Get()
  getAll(@Request() req: RequestComUsuario) {
    return this.charactersService.getAll(req.user.id);
  }

  @Get(":id")
  getOne(
    @Param("id", ParseIntPipe) id: number,
    @Request() req: RequestComUsuario,
  ) {
    return this.charactersService.getOne(id, req.user.id);
  }

  @Post()
  create(@Body() body: CreateCharacterDto, @Request() req: RequestComUsuario) {
    return this.charactersService.create(body, req.user.id);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateCharacterDto,
    @Request() req: RequestComUsuario,
  ) {
    return this.charactersService.update(id, body, req.user.id);
  }

  @Delete(":id")
  @HttpCode(200)
  delete(
    @Param("id", ParseIntPipe) id: number,
    @Request() req: RequestComUsuario,
  ) {
    return this.charactersService.delete(id, req.user.id);
  }
}
