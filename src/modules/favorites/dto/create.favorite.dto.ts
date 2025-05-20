import { IsString } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  movie_id: string;
}
