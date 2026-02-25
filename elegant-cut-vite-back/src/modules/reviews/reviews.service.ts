import { Injectable } from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
    constructor(private readonly reviewsRepo: ReviewsRepository) { }

    async findApproved() {
        return this.reviewsRepo.findAllApproved();
    }

    async create(data: any) {
        return this.reviewsRepo.create(data);
    }
}
