import { Injectable } from "@nestjs/common"
import { createClient, SupabaseClient } from "@supabase/supabase-js"

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_ANON_KEY as string,
    )
  }

  async uploadAudio(file: Express.Multer.File): Promise<string> {
    const filePath = `audios/${Date.now()}-${file.originalname}`

    const { data, error } = await this.supabase.storage
      .from("audio-files")
      .upload(filePath, file.buffer as unknown as Blob, {
        contentType: file.mimetype,
        upsert: true,
      })

    if (error) throw new Error(error.message)

    const { publicUrl } = this.supabase.storage
      .from("audio-files")
      .getPublicUrl(filePath).data

    return publicUrl
  }
}
