import {
    Controller,
    Post,
    Get,
    Param,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Uploads - Archivos e Imágenes')
@Controller('uploads')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    /**
     * ENDPOINT PARA SUBIR IMAGEN
     * POST http://localhost:3001/api/uploads/upload
     */
    @ApiOperation({ summary: 'Subir imagen a Cloudinary', description: 'Permite subir una imagen (avatar, foto de portafolio) al bucket de Cloudinary. Retorna la URL segura y el ID público.' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 201, description: 'Imagen subida exitosamente.' })
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
    @ApiOperation({ summary: 'Obtener URL de una imagen', description: 'Devuelve la URL pública y segura de una imagen previamente subida usando su ID.' })
    @ApiParam({ name: 'id', description: 'ID público de la imagen devuelto por Cloudinary' })
    @Get('view/:id')
    async getImageUrl(@Param('id') id: string) {
        const url = await this.uploadsService.getImageUrl(id);
        return { url };
    }
}