import { Module } from '@nestjs/common';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [MeService],
  controllers: [MeController],
})
export class MeModule {}
