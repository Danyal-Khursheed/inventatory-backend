export class GetAllCompaniesOriginQuery {
  constructor(
    public readonly pageNumber?: number,
    public readonly pageSize?: number,
  ) {}
}
