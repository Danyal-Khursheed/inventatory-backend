import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetPasswordCommand } from '../impl/reset-password.command';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/users.entity';
import { OtpEntity } from 'src/users/entities/otp.entity';
import * as bcrypt from 'bcrypt';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<{ message: string }> {
    const { token, newPassword } = command;

    const user = await this.userRepository.findOne({
      where: { reset_password_token: token },
    });
    if (!user) {
      throw new NotFoundException('Invalide token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }
}
