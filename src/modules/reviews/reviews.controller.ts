import { Body, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create.review.dto';
import { Request } from 'express';

@Controller('movies')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':movie_id/reviews')
  async createReview(
    @Param('movie_id') movie_id: string,
    @Body() body: CreateReviewDto,
    @Req() request: Request,
  ) {
    const user_id = request['userId'];
    return await this.reviewsService.createReview(body, user_id, movie_id);
  }

  @Delete(':movie_id/reviews/:review_id')
  async deleteReviews(
    @Param('movie_id') movie_id: string,
    @Param('review_id') review_id: string,
  ) {
    return await this.reviewsService.deleteReview(movie_id, review_id);
  }
}
