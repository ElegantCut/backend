import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Get()
    async getAll() {
        return this.reviewsService.findApproved();
    }

    @Post()
    async create(@Body() data: any) {
        return this.reviewsService.create(data);
    }
}
