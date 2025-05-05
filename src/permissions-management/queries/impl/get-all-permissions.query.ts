export class GetAllPermissionsQuery {
  constructor(
    public readonly pageNumber?: number,
    public readonly pageSize?: number,
  ) {}
}
