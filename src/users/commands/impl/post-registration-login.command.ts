export class PostRegistrationLoginCommand {
  constructor(
    public readonly email: string,
    public readonly registrationToken: string,
  ) {}
}
