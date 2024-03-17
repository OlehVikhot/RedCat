import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.entity';
import { Permission } from './permissions/permission.entity';
import { SeedModule } from './seed/seed.module';
import { MeModule } from './me/me.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5435,
      username: 'myuser',
      password: 'mypassword',
      database: 'redCat',
      entities: [User, Role, Permission],
      autoLoadEntities: true,
      synchronize: true,
    }),
    RolesModule,
    SeedModule,
    MeModule,
    PermissionsModule,
  ],
})
export class AppModule {}
