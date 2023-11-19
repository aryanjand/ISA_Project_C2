import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private config: ConfigService) {}

  /**
   * Uploads a file to Cloudinary
   * @param {string} buf - The file buffer
   * @param {string} fileId - The file id
   * @param {number} id - The user id
   */
  async uploadFile(buf: string, fileId: string, id: number) {
    const rootPath =
      this.config.getOrThrow('NODE_ENV', 'development') === 'production'
        ? 'production'
        : 'development';
    const response = await cloudinary.uploader.upload(
      `data:image/png;base64,${buf}`,
      {
        resource_type: 'image',
        public_id: `${rootPath}/gallery/${id}/${fileId}`,
      },
    );
    return response;
  }
}
