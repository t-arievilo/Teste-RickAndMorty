import { Body, Controller, Post, BadRequestException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(
    @Body() body: { name: string; email: string; password: string },
  ) {
    if (!body.name || !body.email || !body.password)
      throw new BadRequestException("Preencha todos os campos");
    if (body.password.length < 6)
      throw new BadRequestException("Senha deve ter ao menos 6 caracteres");
    return this.authService.register(body.name, body.email, body.password);
  }

  @Post("login")
  async login(@Body() body: { email: string; password: string }) {
    if (!body.email || !body.password)
      throw new BadRequestException("Preencha todos os campos");
    return this.authService.login(body.email, body.password);
  }
}
