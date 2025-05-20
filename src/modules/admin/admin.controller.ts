import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  SetMetadata,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CreateCategoryDto } from './dto/create.category.dto';
import { CreateMovieDto } from './dto/create.movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { diskStorage } from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { CreateMovieFileDto } from './dto/create.movie.file.dto';

@Controller('admin')
@UseGuards(RoleGuard)
@SetMetadata('roles', ['admin', 'superadmin'])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @SetMetadata('isFreeAuth', true)
  async getAllmovies() {
    return await this.adminService.getAllMovies();
  }

  @Post('add/category')
  async createCategory(@Body() body: CreateCategoryDto) {
    return await this.adminService.createCategory(body);
  }

  @Post('movies')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        filename: (req, file, callback) => {
          const extName = path.extname(file.originalname);
          const fileName = `${uuid()}${extName}`;
          callback(null, fileName);
        },

        destination: './uploads/posters',
      }),
      fileFilter: (req, file, callback) => {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowed.includes(file.mimetype)) {
          return callback(
            new UnsupportedMediaTypeException(
              'Only .jpg, .jpeg, .png image types are allowed!',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async createMovie(
    @Body() body: CreateMovieDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    if (!file) throw new NotFoundException('file not found');
    const created_by = request['userId'];
    return await this.adminService.createMovie(body, file.filename, created_by);
  }

  @Put('movies/:movie_id')
  async updatedMovie(
    @Body() body: UpdateMovieDto,
    @Param('movie_id') movie_id: string,
  ) {
    try {
      return await this.adminService.updateMovie(body, movie_id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Delete('movies/:movie_id')
  async deleteMovie(@Param('movie_id') movie_id: string) {
    try {
      return await this.adminService.deleteMovie(movie_id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post('movies/:movie_id/files')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename: (req, file, callback) => {
          const extName = path.extname(file.originalname);
          const fileName = `${uuid()}${extName}`;
          callback(null, fileName);
        },

        destination: './uploads/videos',
      }),
      fileFilter: (req, file, callback) => {
        const allowed = [
          'video/mp4',
          'video/x-msvideo',
          'video/quicktime',
          'video/x-matroska',
        ];
        if (!allowed.includes(file.mimetype)) {
          return callback(
            new UnsupportedMediaTypeException(
              'Only .mp4, .avi, .mov, .mkv video types are allowed!',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async createMovieFiles(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateMovieFileDto,
    @Param('movie_id') movie_id: string,
  ) {
    if (!file) throw new NotFoundException('File not found');
    return await this.adminService.createMovieFile(
      body,
      file.filename,
      movie_id,
      Math.ceil(file.size / 1024 / 1024),
    );
  }
}
