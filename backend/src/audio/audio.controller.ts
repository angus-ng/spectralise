import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import multer from "multer"
import { SupabaseService } from "../supabase/supabase.service"
import { Express } from "express"

@Controller("audio")
export class AudioController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file", { storage: multer.memoryStorage() }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No file uploaded")
    }

    if (!file.mimetype.startsWith("audio/")) {
      throw new BadRequestException(
        "Invalid file type. Only audio files are allowed.",
      )
    }

    const audioUrl = await this.supabaseService.uploadAudio(file)
    return { url: audioUrl }
  }
}
