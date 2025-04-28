import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRegistrationLoginCommand } from '../impl/post-registration-login.command';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entity/users.entity';
import { JwtPayload } from 'src/auth/auth.guard';

@CommandHandler(PostRegistrationLoginCommand)
export class PostRegistrationLoginHandler
  implements ICommandHandler<PostRegistrationLoginCommand>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: PostRegistrationLoginCommand) {
    const { email, registrationToken } = command;

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        registrationToken,
        { secret: process.env.JWT_SECRET },
      );

      if (!payload || payload.email !== email) {
        throw new UnauthorizedException('Invalid registration token');
      }

      const userData = await this.userRepository.findOne({
        where: { id: payload.id },
      });

      if (!userData) {
        throw new UnauthorizedException('User not found');
      }

      return {
        user: {
          id: userData.id,
          companyName: userData.companyName,
          name: userData.fullName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          role: userData.role,
        },
        token: {
          token: registrationToken,
          refreshToken: userData.refreshToken,
        },
      };
    } catch (error) {
      throw new UnauthorizedException(error || 'Invalid or expired token');
    }
  }
}
