import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMovies(query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = query.search?.toLowerCase() || '';
    const category = query.category?.toLowerCase();
    const subscription_type = query.subscription_type;

    const whereCondition: any = {
      title: {
        contains: search,
        mode: 'insensitive',
      },
      ...(subscription_type && { subscription_type }),
      ...(category && {
        movie_category: {
          some: {
            category: {
              name: {
                equals: category,
                mode: 'insensitive',
              },
            },
          },
        },
      }),
    };

    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        where: whereCondition,
        skip,
        take: limit,
        include: {
          movie_category: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          createdat: 'desc',
        },
      }),
      this.prisma.movie.count({
        where: whereCondition,
      }),
    ]);

    const mappedMovies = movies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      slug: movie.slug,
      poster_url: movie.poster_url,
      release_year: movie.release_year,
      rating: movie.rating,
      subscription_type: movie.subscription_type,
      categories: movie.movie_category.map((mc) => mc.category.name),
    }));

    return {
      success: true,
      data: {
        movies: mappedMovies,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getMovieBySlug(slug: string, userId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { slug },
      include: {
        movie_category: {
          include: {
            category: true,
          },
        },
        movie_file: true,
        review: true,
        favorite: userId
          ? {
              where: { user_id: userId },
              select: { id: true },
            }
          : false,
      },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    await this.prisma.movie.update({
      where: { slug },
      data: { view_count: movie.view_count + 1 },
    });

    const reviewCount = movie.review.length;
    const averageRating =
      reviewCount > 0
        ? movie.review.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

    return {
      success: true,
      data: {
        id: movie.id,
        title: movie.title,
        slug: movie.slug,
        description: movie.description,
        release_year: movie.release_year,
        duration_minutes: movie.duration_minute,
        poster_url: movie.poster_url,
        rating: movie.rating,
        subscription_type: movie.subscription_type,
        view_count: movie.view_count,
        is_favorite: userId ? movie.favorite.length > 0 : false,
        categories: movie.movie_category.map((mc) => mc.category.name),
        files: movie.movie_file.map((file) => ({
          quality: file.quality,
          language: file.language,
        })),
        reviews: {
          average_rating: parseFloat(averageRating.toFixed(1)),
          count: reviewCount,
        },
      },
    };
  }
}
