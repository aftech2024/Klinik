import {
  Controller, Post, UploadedFile, UseGuards, UseInterceptors,
  BadRequestException, InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

const BUCKET = 'clinic-uploads';

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new InternalServerErrorException('Supabase storage not configured');
  return createClient(url, key);
}

@Controller('api/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^image\//)) {
          return cb(new BadRequestException('Hanya file gambar yang diizinkan'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File tidak ditemukan');

    const supabase = getSupabase();
    const filename = `${uuid()}${extname(file.originalname)}`;
    const path = `doctors/${filename}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new InternalServerErrorException(`Upload gagal: ${error.message}`);

    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const url = publicData.publicUrl;

    return { url, filename, size: file.size };
  }
}
