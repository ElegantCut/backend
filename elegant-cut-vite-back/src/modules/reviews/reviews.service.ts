import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepo: ReviewsRepository,
  ) {}

  async findApproved() {
    return this.reviewsRepo.findAllApproved();
  }

  async create(data: any) {
    const review = await this.reviewsRepo.create(data);
    return review;
  }

  async obtenerResenas() {
    return this.reviewsRepo.obtenerResenas();
  }

  async findAllAdmin(status?: string) {
    return this.reviewsRepo.findAllAdmin(status);
  }

  async changeStatusAdmin(id: number, nuevoEstado: number) {
    await this.reviewsRepo.changeStatusAdmin(id, nuevoEstado);
    return { success: true };
  }

  async deleteAdmin(id: number) {
    const review = await this.reviewsRepo.findById(id);

    if (!review) {
      throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
    }

    await this.reviewsRepo.deleteAdmin(id);

    return { success: true };
  }

  async findBarberReviews(idBarbero: number) {
    return this.reviewsRepo.findBarberReviews(idBarbero);
  }
}
