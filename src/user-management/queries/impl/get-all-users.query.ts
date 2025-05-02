export class GetAllUsersQuery {
  constructor(
    public readonly pageNumber: number = 1,
    public readonly pageSize: number = 10,
    public readonly searchTerm?: string,
  ) {}
}
