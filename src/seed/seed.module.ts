import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/roles.entity';
import { Permission } from '../permissions/permission.entity';
import { SeedService } from './seed.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role, User])],
  providers: [SeedService],
})
export class SeedModule {}
