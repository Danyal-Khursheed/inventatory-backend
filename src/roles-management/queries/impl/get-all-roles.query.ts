export class GetAllRolesQuery {
  constructor(
    public readonly pageNumber: number = 1,
    public readonly pageSize: number = 10,
  ) {}
}
