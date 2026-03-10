import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import db from "../database/database";
import { type UsuarioDB } from "../types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: { sub: number; email: string }) {
    const usuario = db
      .prepare("SELECT id, name, email FROM users WHERE id = ?")
      .get(payload.sub) as UsuarioDB | undefined;
    if (!usuario) throw new UnauthorizedException();
    return usuario;
  }
}
