import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as express from "express"
import * as dotenv from "dotenv"
import { ExpressAdapter } from "@nestjs/platform-express"

dotenv.config()

export async function bootstrap() {
  const expressApp = express()
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  )

  app.enableCors({
    origin: process.env.frontend,
    methods: "GET,POST",
    credentials: true,
  })

  await app.init()

  return expressApp
}
