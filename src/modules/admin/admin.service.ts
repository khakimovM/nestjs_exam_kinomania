import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateCategoryDto } from './dto/create.category.dto';
import ShortUniqueId from 'short-unique-id';
import slugify from 'slugify';
import { CreateMovieDto } from './dto/create.movie.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { CreateMovieFileDto } from './dto/create.movie.file.dto';
import path from 'path';
import deleteFile from 'src/common/utils/delete.file';

@Injectable()
export class AdminService {
  private readonly uid = new ShortUniqueId({ length: 8 });
  constructor(private readonly prisma: PrismaService) {}

  async getAllMovies() {
    return await this.prisma.movie.findMany();
  }

  async createCategory(categoryData: CreateCategoryDto) {
    const slug = await this.createSlug(categoryData.name);
    const newCategory = await this.prisma.category.create({
      data: { ...categoryData, slug },
    });
    return { message: 'Category successfully created', data: newCategory };
  }

  async createMovie(
    movieData: CreateMovieDto,
    poster_url: string,
    created_by: string,
  ) {
    const slug = await this.createSlug(movieData.title);

    const { category_ids, ...movieInfo } = movieData;

    const movie = await this.prisma.movie.create({
      data: {
        ...movieInfo,
        slug,
        poster_url,
        created_by,

        movie_category: {
          create: category_ids.map((id) => ({
            category: {
              connect: { id },
            },
          })),
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        createdat: true,
      },
    });
    return { message: "Yangi kino muvaffaqiyatli qo'shildi", data: movie };
  }

  async createSlug(name: string) {
    return slugify(name, { strict: true, lower: true }) + '-' + this.uid.rnd();
  }

  async updateMovie(movieData: UpdateMovieDto, movie_id: string) {
    const movie = await this.prisma.movie.findFirst({
      where: { id: movie_id },
    });

    if (!movie) throw new NotFoundException('Movie not found');

    const { category_ids, ...movieInfo } = movieData;

    await this.prisma.movie_category.deleteMany({
      where: { category_id: { in: category_ids } },
    });

    const updatedMovie = await this.prisma.movie.update({
      where: { id: movie_id },
      data: {
        ...movieInfo,
        movie_category: {
          create: category_ids.map((id) => ({
            category: {
              connect: { id },
            },
          })),
        },
      },
      select: { id: true, title: true, updatedat: true },
    });

    return { message: 'Kino muvaffaqiyatli yangilandi', data: updatedMovie };
  }

  async deleteMovie(movie_id: string) {
    const movie = await this.prisma.movie.findFirst({
      where: { id: movie_id },
    });

    if (!movie) throw new NotFoundException('Movie not found');

    await this.prisma.movie.delete({ where: { id: movie_id } });
    const filePath = path.join(
      process.cwd(),
      '/uploads/posters' + movie.poster_url,
    );

    await deleteFile(filePath);

    return { message: "Kino muvaffaqiyatli o'chirildi" };
  }

  async createMovieFile(
    movieFileData: CreateMovieFileDto,
    file_url: string,
    movie_id: string,
    size_mb: number,
  ) {
    const movie = await this.prisma.movie.findFirst({
      where: { id: movie_id },
    });

    if (!movie) throw new NotFoundException('Movie not found');

    const data = await this.prisma.movie_file.create({
      data: { ...movieFileData, movie_id, file_url },
    });
    return {
      message: 'Kino fayli muvaffaqiyatli yuklandi',
      data: { ...data, size_mb },
    };
  }
}
