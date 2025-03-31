import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
  Headers,
} from "@nestjs/common"
import { type Response } from "express"
import { AuthGuard } from "./auth.guard"
import cookie from "cookie"

@Controller("api")
export class ApiController {
  @Get("verify")
  async verify(@Headers("cookie") cookies: string, @Res() res: Response) {
    // const cookiesObject = cookie.parse(cookies)
    // const accessToken = cookiesObject.access_token

    // if (!accessToken) {
    //   return res.status(401).send("Unauthorized")
    // }

    return res.status(200).send("authenticated")
    // Here, verify the accessToken
    // const isAuthenticated =
    //   await this.spotifyService.verifyAccessToken(accessToken)
    // if (isAuthenticated) {
    //   return res.status(200).send("Authenticated")
    // } else {
    //   return res.status(401).send("Unauthorized")
    // }
  }
}
