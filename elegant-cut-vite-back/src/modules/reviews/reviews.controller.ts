import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    // este es el del ejemplo de prisma

    @Get()
    async obtenerResenas() {
        return this.reviewsService.obtenerResenas();
    }


    @Post()
    async create(@Body() data: any) {
        return this.reviewsService.create(data);
    }
}
