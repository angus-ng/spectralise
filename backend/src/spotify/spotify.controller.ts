import { Controller, Get, Param, Query, Res, Headers } from "@nestjs/common"
import { SpotifyService } from "./spotify.service"
import { Response } from "express"

@Controller("spotify")
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get("login")
  login(@Res() res: Response) {
    const authUrl = this.spotifyService.getAuthorizationUrl()
    return res.redirect(authUrl)
  }

  @Get("callback")
  async callback(@Query("code") code: string, @Res() res: Response) {
    try {
      const tokenData = await this.spotifyService.getAccessToken(code)

      console.log("Access token:", tokenData.access_token)
      res.cookie("access_token", tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      })
      res.cookie("refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      })

      return res.redirect(
        `${process.env.frontend}callback?access_token=${tokenData.access_token}`,
      )
    } catch (error) {
      console.error("Authentication failed:", error)
      return res.status(500).send("Authentication failed")
    }
  }

  @Get("top-tracks")
  async getTopTracks(
    @Headers("authorization") authorization: string,
    @Query("timeRange") timeRange: string,
  ) {
    if (!authorization) {
      throw new Error("No authorization header found")
    }
    const accessToken = authorization.replace("Bearer ", "")
    const validTimeRanges = ["short_term", "medium_term", "long_term"]
    if (!validTimeRanges.includes(timeRange)) {
      throw new Error("Invalid timeRange provided")
    }
    return this.spotifyService.getTopTracks(accessToken, timeRange)
  }

  @Get("artists/:artistIdList")
  async getArtists(
    @Param("artistIdList") artistIdList: string,
    @Headers("authorization") authorization: string,
  ) {
    if (!authorization) {
      throw new Error("No authorization header found")
    }
    const accessToken = authorization.replace("Bearer ", "")
    return this.spotifyService.getArtists(artistIdList, accessToken)
  }
}
