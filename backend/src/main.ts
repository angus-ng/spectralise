import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import express from "express"
import { ExpressAdapter } from "@nestjs/platform-express"

async function bootstrap() {
  const expressApp = express()
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  )

  app.enableCors()
  await app.init()

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
