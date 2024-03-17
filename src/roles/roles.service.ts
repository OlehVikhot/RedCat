import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';

@Injectable()
export class RolesService {
  constructor() {}

  async getRoles(user: User) {
    return { roles: user.roles };
  }
}
