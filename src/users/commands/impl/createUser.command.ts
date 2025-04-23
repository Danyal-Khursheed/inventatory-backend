export class CreateUserCommand {
    constructor(
      public readonly userName: string,
      public readonly email: string,
    ) {}
  }
  