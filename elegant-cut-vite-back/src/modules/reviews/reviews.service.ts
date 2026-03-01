import { Injectable } from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
    constructor(private readonly reviewsRepo: ReviewsRepository, private readonly prisma: PrismaService) { }

    async findApproved() {
        return this.reviewsRepo.findAllApproved();
    }

    async create(data: any) {
        return this.reviewsRepo.create(data);
    }

    //Este es de prisma RECORDAR

    async obtenerResenas() {
        return this.prisma.resenas.findMany();
    }
}
