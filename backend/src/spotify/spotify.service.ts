import { Injectable } from "@nestjs/common"
import axios from "axios"

@Injectable()
export class SpotifyService {
  private clientId: string = process.env.SPOTIFY_CLIENT_ID!
  private clientSecret: string = process.env.SPOTIFY_CLIENT_SECRET!
  private redirectUri: string = process.env.SPOTIFY_REDIRECT_URI!

  getAuthorizationUrl() {
    const scope = "user-top-read"
    return `https://accounts.spotify.com/authorize?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(scope)}`
  }

  async getAccessToken(code: string) {
    const tokenUrl = "https://accounts.spotify.com/api/token"
    const params = new URLSearchParams({
      code,
      redirect_uri: this.redirectUri,
      grant_type: "authorization_code",
      client_id: this.clientId,
      client_secret: this.clientSecret,
    })

    try {
      const response = await axios.post(tokenUrl, params.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      return response.data
    } catch (error) {
      console.error("Error getting access token:", error)
      throw new Error("Failed to get access token")
    }
  }

  async getTopTracks(accessToken: string, timeRange: string) {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      return response.data.items
    } catch (error) {
      console.error("Error fetching top tracks:", error)
      throw new Error("Failed to fetch top tracks")
    }
  }
  async getArtists(artistIdList: string, accessToken: string) {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/artists/${artistIdList}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      return response.data.genres
    } catch (error) {
      console.error("Error fetching artist info:", error)
      throw new Error("Failed to fetch artist info")
    }
  }
}
