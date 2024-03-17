import * as argon from 'argon2';
import { Response } from 'express';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto, SignUpDto } from './dto';
import { User } from '../users/user.entity';
import { setup } from '../../setup';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/roles.entity';
import { DEFAULT_CURRENT_USER_ROLE, DEFAULT_USER_ROLES } from '../config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,

    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: SignUpDto): Promise<{ access_token: string }> {
    const hash = await argon.hash(dto.password);

    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ForbiddenException('Credentials taken');
    }

    const roles = DEFAULT_USER_ROLES.map((roleName) => ({ name: roleName }));

    const newUser = await this.usersRepository.save({
      email: dto.email.toLowerCase(),
      password: hash,
      currentRole: { name: DEFAULT_CURRENT_USER_ROLE },
      roles,
    });

    return this.signToken(newUser.id, newUser.email);
  }

  async signin(dto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password) {
      throw new UnauthorizedException('Please reset your password');
    }

    const passwordCorrect = await argon.verify(user.password, dto.password);

    if (!passwordCorrect) {
      throw new UnauthorizedException('Wrong credentials');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };
    const secret = this.configService.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: setup.accessTokenLifetime,
      secret,
    });

    return { access_token: token };
  }

  setAccessTokenCookie(res: Response, access_token: string): void {
    const expires = new Date(Date.now() + setup.accessTokenLifetime);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires,
    });
  }

  invalidateAccessTokenCookie(res: Response): void {
    res.cookie('access_token', null, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(0),
    });
  }
}
