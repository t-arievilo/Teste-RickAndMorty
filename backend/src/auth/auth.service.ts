import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import db from "../database/database";
import { ok } from "assert/strict";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(name: string, email: string, password: string) {
    const emailJaExiste = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);
    if (emailJaExiste) throw new ConflictException("Email já cadastrado");

    const hash = await bcrypt.hash(password, 10);
    const resultado = db
      .prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
      .run(name, email, hash);

    const token = this.jwtService.sign({
      sub: resultado.lastInsertRowid,
      email,
    });
    return { token, name, email };
  }

  async login(email: string, password: string) {
    const usuario = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;
    if (!usuario) throw new UnauthorizedException("Email ou senha incorretos");

    const credenciaisConferem = await bcrypt.compare(
      password,
      usuario.password,
    );
    if (!credenciaisConferem)
      throw new UnauthorizedException("Email ou senha incorretos");

    const token = this.jwtService.sign({
      sub: usuario.id,
      email: usuario.email,
    });
    return { token, name: usuario.name, email: usuario.email };
  }
}
