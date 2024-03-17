import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ESortOrder } from '../../constant/ESortOrder';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  @ApiPropertyOptional({
    description: 'The page number for pagination',
    example: 1,
    minimum: 1,
  })
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  @ApiPropertyOptional({
    description: 'The number of items per page for pagination',
    example: 10,
    minimum: 1,
  })
  pageSize: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The field by which to sort the users',
    example: 'createdAt',
  })
  sortBy?: string;

  @IsOptional()
  @IsString()
  @IsEnum(ESortOrder)
  @ApiPropertyOptional({
    description: 'The order by which to sort the users',
    example: ESortOrder.ASC,
    enum: ESortOrder,
  })
  orderBy?: string;
}
