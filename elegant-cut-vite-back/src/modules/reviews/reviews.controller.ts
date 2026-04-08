import { Controller, Get, Post, Body, Query, Patch, Delete, Param, ParseIntPipe } from '@nestjs/common';
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

    @ApiOperation({ summary: 'Obtener reseñas por barbero', description: 'Devuelve las reseñas aprobadas para un barbero específico.' })
    @Get('barber/:id')
    async getBarberReviews(@Param('id', ParseIntPipe) id: number) {
        return this.reviewsService.findBarberReviews(id);
    }

    @ApiOperation({ summary: 'Obtener reseñas para Admin', description: 'Listado completo para el panel de administración, opcionalmente filtrado por estado (approved/spam)' })
    @Get('admin/all')
    async getAdminReviews(@Query('status') status: string) {
        return this.reviewsService.findAllAdmin(status);
    }


    @ApiOperation({ summary: 'Crear una nueva reseña', description: 'Registra una calificación/reseña de un cliente sobre su cita.' })
    @ApiBody({ schema: { type: 'object', properties: { calificacion: { type: 'number', example: 5 }, comentario: { type: 'string', example: 'Excelente servicio' }, id_cita: { type: 'number', example: 10 } } } })
    @ApiResponse({ status: 201, description: 'Reseña creada exitosamente.' })
    @Post()
    async create(@Body() data: any) {
        try {
            return await this.reviewsService.create(data);
        } catch (error) {
            console.error('ERROR CREANDO RESEÑA:', error);
            throw error; // Dejar que Nest lo maneje pero ya lo logueamos en el contenedor
        }
    }

    // --- MÉTODOS DE ACCIÓN ADMINISTRATIVA ---

    @ApiOperation({ summary: 'Cambiar estado de reseña', description: 'Permite al admin aprobar (1) o marcar como spam (0) una reseña específica.' })
    @Patch('admin/:id/status')
    async changeStatus(@Param('id', ParseIntPipe) id: number, @Body('estado') estado: number) {
        return this.reviewsService.changeStatusAdmin(id, estado);
    }

    @ApiOperation({ summary: 'Eliminar reseña definitivamente', description: 'Borra de manera permanente una reseña ofensiva o equivocada de la base de datos.' })
    @Delete('admin/:id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.reviewsService.deleteAdmin(id);
    }
}
