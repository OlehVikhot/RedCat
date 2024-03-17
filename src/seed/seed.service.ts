import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../permissions/permission.entity';
import { Repository } from 'typeorm';
import { Role } from '../roles/roles.entity';
import { EUserRoles } from '../constant/EUserRoles';
import { EPermissions } from '../constant/EPermissions';
import { User } from '../users/user.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,

    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    const permissions = await this.permissionsRepository.save(
      Object.values(EPermissions).map((name) => ({ name })),
    );

    const permissionMapping = permissions.reduce((acc, permission) => {
      acc[permission.name] = permission;
      return acc;
    }, {});

    const seedRoles = [
      {
        name: EUserRoles.ADMIN,
        permissions: [
          permissionMapping[EPermissions.GET_USERS],
          permissionMapping[EPermissions.DELETE_USERS],
          permissionMapping[EPermissions.GET_ANY_ARTICLES],
          permissionMapping[EPermissions.DELETE_ANY_ARTICLES],
        ],
      },
      {
        name: EUserRoles.EDITOR,
        permissions: [
          permissionMapping[EPermissions.GET_ARTICLES],
          permissionMapping[EPermissions.DELETE_ARTICLES],
          permissionMapping[EPermissions.PUT_ARTICLES],
          permissionMapping[EPermissions.PATCH_ARTICLES],
        ],
      },
      {
        name: EUserRoles.VIEWER,
        permissions: [permissionMapping[EPermissions.GET_ARTICLES]],
      },
    ];

    await this.rolesRepository.save(seedRoles);

    const adminRole = await this.rolesRepository.findOneBy({
      name: EUserRoles.ADMIN,
    });
    const viewerRole = await this.rolesRepository.findOneBy({
      name: EUserRoles.VIEWER,
    });
    const editorRole = await this.rolesRepository.findOneBy({
      name: EUserRoles.EDITOR,
    });

    const adminUser = {
      email: 'admin@test.com',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$vXZzg5GuEUhXVMVOuGsa+w$fOyMQaipyd+hCBD3+BL2959V615TZDQkjWSBfuIgelo',
      currentRole: adminRole,
      roles: [adminRole, viewerRole, editorRole],
    };

    await this.usersRepository.save(adminUser);
  }
}
