import {
    Controller,
    Post,
    Get,
    Param,
    UseInterceptors,
    UploadedFile,
    BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    /**
     * ENDPOINT PARA SUBIR IMAGEN
     * POST http://localhost:3001/api/uploads/upload
     */
    @Post('upload')
    @UseInterceptors(FileInterceptor('file')) // 'file' es el nombre de la llave en Postman
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No se ha enviado ningún archivo');
        }

        const result = await this.uploadsService.uploadFile(file);

        // Cloudinary nos devuelve un public_id único para esa foto
        return {
            message: 'Imagen subida correctamente',
            public_id: result.public_id,
            url: result.secure_url,
        };
    }

    /**
     * ENDPOINT PARA VER IMAGEN
     * GET http://localhost:3001/api/uploads/view/id_de_la_foto
     */
    @Get('view/:id')
    async getImageUrl(@Param('id') id: string) {
        const url = await this.uploadsService.getImageUrl(id);
        return { url };
    }
}