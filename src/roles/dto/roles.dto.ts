import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EUserRoles } from '../../constant/EUserRoles';

export class UpdateUserRoleDto {
  @IsString()
  @IsEnum(EUserRoles)
  @ApiProperty({
    description: 'The new role to assign to the me',
    enum: EUserRoles,
    example: EUserRoles.ADMIN,
  })
  role: EUserRoles;
}
