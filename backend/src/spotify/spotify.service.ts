import { Injectable } from "@nestjs/common"
import axios from "axios"

@Injectable()
export class SpotifyService {
  private clientId: string = process.env.SPOTIFY_CLIENT_ID!
  private clientSecret: string = process.env.SPOTIFY_CLIENT_SECRET!
  private accessToken: string | null = null
  private tokenExpiry: number | null = null

  constructor() {}

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const { data } = await axios.post<{
        access_token: string
        expires_in: number
      }>(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({ grant_type: "client_credentials" }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
          },
        },
      )

      if (!data.access_token) {
        throw new Error("Spotify API did not return an access token")
      }

      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + data.expires_in * 1000

      return this.accessToken
    } catch (error) {
      console.error("Failed to get Spotify access token:", error)
      throw new Error("Unable to authenticate with Spotify")
    }
  }

  async getTrackMetadata(trackId: string) {
    const accessToken = await this.getAccessToken()
    const { data } = await axios.get(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    )
    return data
  }

  async getTrackAudioFeatures(trackId: string) {
    const accessToken = await this.getAccessToken()
    const { data } = await axios.get(
      `https://api.spotify.com/v1/audio-features/${trackId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    )
    return data
  }
}
