import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForgotPasswordCommand } from '../impl/forgot-password.command';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/users.entity';
import { OtpEntity } from 'src/users/entities/otp.entity';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler
  implements ICommandHandler<ForgotPasswordCommand>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<{ token: string }> {
    const { email } = command;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found with this email.');
    }

    const token = this.jwtService.sign(
      { id: user?.id },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );

    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15);

    user.reset_password_token = token;
    user.reset_password_expires_at = expiryDate;

    await this.userRepository.save(user);

    return { token };
  }
}
