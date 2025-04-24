import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUserLogin(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.generateTokens(user);
  }

  async generateTokens(user: UserEntity) {
    const secret = this.configService.get<string>('JWT_SECRET');
    const payload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: '60m',
    });

    const refreshToken = this.jwtService.sign(
      { id: user.id },
      { secret, expiresIn: '7d' },
    );

    await this.userRepository.update(user.id, { refreshToken });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken: _, ...userData } = user;

    return {
      user: {
        id: userData.id,
        companyName: userData.companyName,
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
      },
      token: {
        token: accessToken,
        refreshToken: refreshToken,
      },
    };
  }

  async login(user: UserEntity) {
    return this.generateTokens(user);
  }
}
