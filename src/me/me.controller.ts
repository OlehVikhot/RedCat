import { Body, Controller, Delete, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { UpdateUserRoleDto } from '../roles/dto';
import { MeService } from './me.service';

@Controller('me')
export class MeController {
  constructor(private meService: MeService) {}

  @UseGuards(JwtGuard)
  @Patch('role')
  @ApiOperation({ summary: 'Update your current role' })
  @ApiResponse({ status: 200, description: 'Role updated', type: User })
  @ApiBearerAuth()
  async updateUserRole(@GetUser() user: User, @Body() dto: UpdateUserRoleDto) {
    return this.meService.updateUserRole(user, dto);
  }

  @UseGuards(JwtGuard)
  @Delete()
  @ApiOperation({ summary: 'Delete your profile' })
  @ApiResponse({
    status: 204,
    description: 'The me was successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  async deleteUser(@GetUser() user: User) {
    return this.meService.deleteUser(user.id);
  }
}
