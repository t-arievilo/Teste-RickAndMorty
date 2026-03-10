import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import db from "../database/database";
import { type CreateCharacterDto, type UpdateCharacterDto } from "../types";

@Injectable()
export class CharactersService {
  getAll(userId: number) {
    return db
      .prepare(
        "SELECT * FROM characters WHERE user_id = ? ORDER BY created_at DESC",
      )
      .all(userId);
  }

  getOne(id: number, userId: number) {
    const personagemPorId = db
      .prepare("SELECT * FROM characters WHERE id = ? AND user_id = ?")
      .get(id, userId);
    if (!personagemPorId)
      throw new NotFoundException("Personagem não encontrado");
    return personagemPorId;
  }

  create(dados: CreateCharacterDto, userId: number) {
    const personagemJaSalvo = db
      .prepare(
        "SELECT id FROM characters WHERE original_character_id = ? AND user_id = ?",
      )
      .get(dados.original_character_id, userId);
    if (personagemJaSalvo) throw new ConflictException("Personagem já salvo");

    const criaPersonagem = db
      .prepare(
        `
      INSERT INTO characters
        (original_character_id, name, species, gender, origin, location, image, status, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        dados.original_character_id,
        dados.name,
        dados.species || "",
        dados.gender || "",
        dados.origin || "",
        dados.location || "",
        dados.image || "",
        dados.status || "",
        userId,
      );
    return db
      .prepare("SELECT * FROM characters WHERE id = ?")
      .get(criaPersonagem.lastInsertRowid);
  }

  update(id: number, dados: UpdateCharacterDto, userId: number) {
    this.getOne(id, userId);
    db.prepare(
      `
      UPDATE characters SET
        name = COALESCE(?, name), species = COALESCE(?, species),
        gender = COALESCE(?, gender), origin = COALESCE(?, origin),
        location = COALESCE(?, location), status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `,
    ).run(
      dados.name,
      dados.species,
      dados.gender,
      dados.origin,
      dados.location,
      dados.status,
      id,
      userId,
    );
    return db.prepare("SELECT * FROM characters WHERE id = ?").get(id);
  }

  delete(id: number, userId: number) {
    this.getOne(id, userId);
    db.prepare("DELETE FROM characters WHERE id = ? AND user_id = ?").run(
      id,
      userId,
    );
    return { message: "Removido com sucesso" };
  }
}
