import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../users/user.entity';
import { UpdateUserRoleDto } from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('roles')
@Controller()
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @UseGuards(JwtGuard)
  @Get('roles')
  @ApiOperation({ summary: 'Get the roles of the current me' })
  @ApiResponse({
    status: 200,
    description: 'The roles of the me',
    type: [String],
  })
  @ApiBearerAuth()
  async getRoles(@GetUser() user: User) {
    return this.rolesService.getRoles(user);
  }
}
