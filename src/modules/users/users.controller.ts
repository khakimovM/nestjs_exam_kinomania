import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Req,
  Res,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { ChangeRoleDto } from './dto/change-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['superadmin', 'admin'])
  async getMe() {
    return await this.usersService.getAllUsers();
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['superadmin', 'admin', 'owner'])
  @UseInterceptors(FileInterceptor('image'))
  async updateProfile(
    @Body() body: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    console.log(file);
    const fileUrl = file ? file.filename : '';
    return await this.usersService.updateProfile(body, fileUrl, id);
  }

  @Put('changerole/:id')
  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['superadmin'])
  async changeRole(@Body() body: ChangeRoleDto, @Param('id') id: string) {
    return await this.usersService.changeRole(body, id);
  }
}
