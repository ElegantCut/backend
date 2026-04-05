import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsRepository } from './reviews.repository';
import { ReviewsController } from './reviews.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ReviewsController],
    providers: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule { }
