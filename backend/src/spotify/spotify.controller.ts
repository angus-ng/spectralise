import { Controller, Get, Param } from "@nestjs/common"
import { SpotifyService } from "./spotify.service"

@Controller("spotify")
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get("track/:trackId")
  async getTrack(@Param("trackId") trackId: string) {
    return await this.spotifyService.getTrackMetadata(trackId)
  }

  @Get("audio-features/:trackId")
  async getAudioFeatures(@Param("trackId") trackId: string) {
    return await this.spotifyService.getTrackAudioFeatures(trackId)
  }
}
