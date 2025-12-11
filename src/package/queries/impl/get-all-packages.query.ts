export class GetAllPackagesQuery {
  constructor(
    public readonly pageNumber?: number,
    public readonly pageSize?: number,
  ) {}
}
