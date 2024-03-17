import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UpdateUserRoleDto } from '../roles/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/roles.entity';

@Injectable()
export class MeService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async updateUserRole(user: User, dto: UpdateUserRoleDto): Promise<User> {
    const newRole = await this.rolesRepository.findOne({
      where: { name: dto.role },
    });
    if (!newRole) {
      throw new NotFoundException(`Role ${dto.role} not found`);
    }

    user.currentRole = newRole;

    return this.usersRepository.save(user);
  }

  async deleteUser(userId: number): Promise<void> {
    await this.usersRepository.manager.transaction(async (entityManager) => {
      const user = await entityManager.findOne(User, {
        where: { id: userId },
        relations: { roles: true },
      });

      if (!user) throw new Error('User not found');

      for (const role of user.roles) {
        user.roles = user.roles.filter((userRole) => userRole.id !== role.id);
        await entityManager.save(user);
      }

      await entityManager.remove(user);
    });
  }
}
