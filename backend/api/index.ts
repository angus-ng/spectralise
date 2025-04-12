import { bootstrap } from "../src/main"

let server: any = null

export default async function handler(req: any, res: any) {
  if (!server) {
    const app = await bootstrap()
    server = app
  }

  return server(req, res)
}
