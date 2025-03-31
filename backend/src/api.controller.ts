import { Controller, Get, Res, Headers, Post } from "@nestjs/common"
import { type Response } from "express"
import * as cookie from "cookie"
import { SpotifyService } from "./spotify/spotify.service"

@Controller("api")
export class ApiController {
  constructor(private readonly spotifyService: SpotifyService) {}
  @Get("verify")
  async verify(@Headers("cookie") cookies: string, @Res() res: Response) {
    if (!cookies) {
      return res.status(401).json({ message: "Unauthorized: No cookies found" })
    }
    const cookiesObject = cookie.parse(cookies)
    const accessToken = cookiesObject.access_token

    if (!accessToken) {
      return res.status(401).send("Unauthorized")
    }
    const isAuthenticated =
      await this.spotifyService.verifyAccessToken(accessToken)
    if (isAuthenticated) {
      return res.status(200).send("Authenticated")
    } else {
      return res.status(401).send("Unauthorized")
    }
  }
  @Post("logout")
  async logout(@Res() res: Response) {
    res.clearCookie("access_token")
    res.clearCookie("refresh_token")
    return res.status(200).send("Logged out")
  }
  @Get("token")
  async token(@Headers("cookie") cookies: string, @Res() res: Response) {
    if (!cookies) {
      return res.status(401).json({ message: "Unauthorized: No cookies found" })
    }
    const cookiesObject = cookie.parse(cookies)
    const accessToken = cookiesObject.access_token

    if (!accessToken) {
      return res.status(401).send("Unauthorized")
    }

    return res.status(200).json({ accessToken })
  }
}
