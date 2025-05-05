export class GetAllRolesQuery {
  constructor(
    public readonly pageNumber?: number,
    public readonly pageSize?: number,
  ) {}
}
