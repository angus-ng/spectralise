import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as express from "express"
import * as dotenv from "dotenv"
import { ExpressAdapter } from "@nestjs/platform-express"

dotenv.config()

async function bootstrap() {
  const expressApp = express()
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  )

  console.log(process.env.frontend)
  app.enableCors({
    origin: process.env.frontend,
    methods: "GET,POST",
    credentials: true,
  })
  await app.init()

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
