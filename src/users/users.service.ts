import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { GetUsersDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUsers({
    page = 1,
    pageSize = 25,
    sortBy = 'createdAt',
    orderBy = 'ASC',
  }: GetUsersDto) {
    const [users, totalCount] = await this.usersRepository.findAndCount({
      order: { [sortBy]: orderBy },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: {
        roles: true,
        currentRole: true,
      },
    });

    if (!users.length) throw new NotFoundException('No users found');

    return {
      data: users,
      pagination: {
        totalItems: totalCount,
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  }
}
