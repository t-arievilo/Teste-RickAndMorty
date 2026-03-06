import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: /^http:\/\/localhost(:\d+)?$/ });
  app.setGlobalPrefix("api");
  const porta = process.env.PORT || 3001;
  await app.listen(porta);
  console.log(`Backend rodando em http://localhost:${porta}/api`);
}

bootstrap();
