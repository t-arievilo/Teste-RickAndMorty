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

// todas as rotas exigem login
@UseGuards(JwtAuthGuard)
@Controller("characters")
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Get()
  getAll(@Request() req) {
    return this.charactersService.getAll(req.user.id);
  }

  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number, @Request() req) {
    return this.charactersService.getOne(id, req.user.id);
  }

  @Post()
  create(@Body() body: any, @Request() req) {
    return this.charactersService.create(body, req.user.id);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: any,
    @Request() req,
  ) {
    return this.charactersService.update(id, body, req.user.id);
  }

  @Delete(":id")
  @HttpCode(200)
  delete(@Param("id", ParseIntPipe) id: number, @Request() req) {
    return this.charactersService.delete(id, req.user.id);
  }
}
