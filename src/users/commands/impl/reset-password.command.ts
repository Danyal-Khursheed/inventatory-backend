export class ResetPasswordCommand {
  constructor(
    public readonly id: string,
    public readonly otp: string,
    public readonly newPassword: string,
  ) {}
}
