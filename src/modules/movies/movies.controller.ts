import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Request } from 'express';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getMovies(@Query() query: any) {
    console.log(query);
    return this.moviesService.getMovies(query);
  }

  @Get(':slug')
  async getOneMovie(@Param('slug') slug: string, @Req() request: Request) {
    return await this.moviesService.getMovieBySlug(slug, request['userId']);
  }
}
