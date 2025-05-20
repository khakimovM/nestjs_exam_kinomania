import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateReviewDto } from './dto/create.review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(
    reviewData: CreateReviewDto,
    user_id: string,
    movie_id: string,
  ) {
    const movie = await this.prisma.movie.findFirst({
      where: { id: movie_id },
    });

    if (!movie) throw new NotFoundException('Movie not found');

    const review = await this.prisma.review.create({
      data: { ...reviewData, user_id, movie_id },
      select: {
        id: true,
        user: { select: { id: true, username: true } },
        movie_id: true,
        rating: true,
        comment: true,
        createdat: true,
      },
    });

    await this.updateMovieRating(movie_id);

    return { message: "Sharh muvaffaqiyatli qo'shildi", data: review };
  }

  async deleteReview(movie_id: string, review_id: string) {
    const review = await this.prisma.review.findFirst({
      where: { id: review_id },
    });

    if (!review) throw new NotFoundException('Review not found');

    const movie = await this.prisma.movie.findFirst({
      where: { id: movie_id },
    });

    if (!movie) throw new NotFoundException('Movie not found');

    await this.prisma.review.delete({ where: { id: review_id } });
    await this.updateMovieRating(movie_id);

    return { message: "Sharh muvaffaqiyatli o'chirildi" };
  }

  async updateMovieRating(movie_id: string) {
    const reviewsRating = await this.prisma.review.aggregate({
      _avg: { rating: true },
      where: { movie_id },
    });

    if (reviewsRating._avg.rating) {
      await this.prisma.movie.update({
        where: { id: movie_id },
        data: { rating: reviewsRating._avg.rating },
      });
    }
  }
}
