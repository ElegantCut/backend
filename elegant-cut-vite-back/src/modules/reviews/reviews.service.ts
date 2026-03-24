import { Injectable, BadRequestException } from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
    constructor(private readonly reviewsRepo: ReviewsRepository, private readonly prisma: PrismaService) { }

    async findApproved() {
        return this.reviewsRepo.findAllApproved();
    }

    async create(data: any) {
        if (!data || !data.comentario || !data.calificacion) {
            throw new BadRequestException('El comentario y la calificación son requeridos');
        }

        if (data.calificacion < 1 || data.calificacion > 5) {
            throw new BadRequestException('La calificación debe estar entre 1 y 5');
        }

        return this.reviewsRepo.create(data);
    }

    //Este es de prisma RECORDAR

    async obtenerResenas() {
        // FIXME: La tabla 'resenas' ya no existe en la base de datos
        // return this.prisma.resenas.findMany();
        return [];
    }
}
