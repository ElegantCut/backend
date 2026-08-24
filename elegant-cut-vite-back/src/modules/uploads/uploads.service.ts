import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class UploadsService {
  constructor() {
    // Configuración de cloudinary usando tus variables de entorno
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * SUBIR IMAGEN:
   * Esta función recibe el archivo desde el controlador y lo envía a Cloudinary.
   */
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'elegant_cut', // Opcional: crea una carpeta en tu Cloudinary
        },
        (error, result) => {
          if (error) return reject(new Error(error.message || 'Error al subir a Cloudinary'));
          if (!result)
            return reject(
              new Error('Upload failed: no result from Cloudinary'),
            );
          resolve(result);
        },
      );

      // Escribimos los datos binarios del archivo en el stream de subida
      upload.end(file.buffer);
    });
  }

  /**
   * VER IMAGEN:
   * Genera la URL para que React la consuma.
   */
  async getImageUrl(publicId: string) {
    return cloudinary.url(publicId, {
      secure: true,
    });
  }
}
