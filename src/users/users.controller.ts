import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guard';
import { GetUsersDto } from './dto/users.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '../permissions/decorator/permissions.decorator';
import { EPermissions } from '../constant/EPermissions';

@ApiTags('users')
@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('users')
  @ApiOperation({ summary: 'Get a list of users' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 404, description: 'No users found' })
  @ApiBearerAuth()
  @Permissions([EPermissions.GET_USERS])
  async getUsers(@Query() dto: GetUsersDto) {
    return this.usersService.getUsers(dto);
  }
}
