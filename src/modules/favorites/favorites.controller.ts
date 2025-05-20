import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create.favorite.dto';
import { Request } from 'express';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async addToFavorites(
    @Body() body: CreateFavoriteDto,
    @Req() request: Request,
  ) {
    return await this.favoritesService.addToFavorite(
      request['userId'],
      body.movie_id,
    );
  }

  @Get()
  async getMyFavoriyes(@Req() request: Request) {
    return await this.favoritesService.getMyFavorites(request['userId']);
  }

  @Delete(':movie_id')
  async deleteFavorite(
    @Param('movie_id') movie_id: string,
    @Req() request: Request,
  ) {
    return await this.favoritesService.deleteMyFavorite(
      request['userId'],
      movie_id,
    );
  }
}
