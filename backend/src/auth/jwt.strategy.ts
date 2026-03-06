import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import db from "../database/database";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: { sub: number; email: string }) {
    const usuarios = db
      .prepare("SELECT id, name, email FROM users WHERE id = ?")
      .get(payload.sub) as any;
    if (!usuarios) throw new UnauthorizedException();
    return usuarios;
  }
}
