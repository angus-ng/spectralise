import { Controller, Get, Res, Headers, Post } from "@nestjs/common"
import { type Response } from "express"
import * as cookie from "cookie"

@Controller("api")
export class ApiController {
  @Get("verify")
  async verify(@Headers("cookie") cookies: string, @Res() res: Response) {
    const cookiesObject = cookie.parse(cookies)
    const accessToken = cookiesObject.access_token

    if (!accessToken) {
      return res.status(401).send("Unauthorized")
    }

    return res.status(200).send("Authenticated")
    // Here, verify the accessToken
    // const isAuthenticated =
    //   await this.spotifyService.verifyAccessToken(accessToken)
    // if (isAuthenticated) {
    //   return res.status(200).send("Authenticated")
    // } else {
    //   return res.status(401).send("Unauthorized")
    // }
  }
  @Post("logout")
  async logout(@Res() res: Response) {
    res.clearCookie("access_token")
    res.clearCookie("refresh_token")
    return res.status(200).send("Logged out")
  }
  @Get("token")
  async token(@Headers("cookie") cookies: string, @Res() res: Response) {
    const cookiesObject = cookie.parse(cookies)
    const accessToken = cookiesObject.access_token

    if (!accessToken) {
      return res.status(401).send("Unauthorized")
    }

    return res.status(200).json({ accessToken })
  }
}
