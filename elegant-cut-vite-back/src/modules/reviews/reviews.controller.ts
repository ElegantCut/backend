import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews - Reseñas')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    // este es el del ejemplo de prisma

    @ApiOperation({ summary: 'Obtener todas las reseñas', description: 'Devuelve todas las reseñas o calificaciones registradas.' })
    @Get()
    async obtenerResenas() {
        return this.reviewsService.obtenerResenas();
    }


    @ApiOperation({ summary: 'Crear una nueva reseña', description: 'Registra una calificación/reseña de un cliente sobre su cita.' })
    @ApiBody({ schema: { type: 'object', properties: { calificacion: { type: 'number', example: 5 }, comentario: { type: 'string', example: 'Excelente servicio' }, id_cita: { type: 'number', example: 10 } } } })
    @ApiResponse({ status: 201, description: 'Reseña creada exitosamente.' })
    @Post()
    async create(@Body() data: any) {
        return this.reviewsService.create(data);
    }
}
