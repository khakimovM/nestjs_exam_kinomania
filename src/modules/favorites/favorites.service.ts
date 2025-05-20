import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async addToFavorite(user_id: string, movie_id: string) {
    const findMovie = await this.prisma.movie.findFirst({
      where: { id: movie_id },
    });

    if (!findMovie) throw new NotFoundException('Movie not found');

    const checkFavorite = await this.prisma.favorite.findFirst({
      where: { user_id, movie_id },
    });

    if (checkFavorite)
      throw new ConflictException('Movie already added to favorites');

    const { movie, ...others } = await this.prisma.favorite.create({
      data: { user_id, movie_id },
      select: {
        id: true,
        movie_id: true,
        movie: { select: { title: true } },
        createdat: true,
      },
    });

    return {
      message: "Kino sevimlilar ro'yxatiga qo'shildi",
      data: { ...others, movie_title: movie.title },
    };
  }

  async getMyFavorites(user_id: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { user_id },
      select: {
        movie: {
          select: {
            id: true,
            title: true,
            slug: true,
            poster_url: true,
            release_year: true,
            rating: true,
            subscription_type: true,
          },
        },
      },
    });

    const count = await this.prisma.favorite.aggregate({
      where: { user_id },
      _count: true,
    });

    return {
      success: true,
      data: {
        movies: favorites.map((fav) => fav.movie),
        total: count._count,
      },
    };
  }

  async deleteMyFavorite(user_id: string, movie_id: string) {
    const checkFavorite = await this.prisma.favorite.findFirst({
      where: { user_id, movie_id },
    });

    if (!checkFavorite)
      throw new NotFoundException(
        "You didn't add this movie to your favorites",
      );

    await this.prisma.favorite.delete({
      where: { user_id_movie_id: { user_id, movie_id } },
    });

    return { message: "Kino sevimlilar ro'yxatidan o'chirildi" };
  }
}
