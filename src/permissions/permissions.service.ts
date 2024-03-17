import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUserPermissions(userId: number): Promise<string[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: {
        currentRole: {
          permissions: true,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.currentRole.permissions.map((permission) => permission.name);
  }
}
