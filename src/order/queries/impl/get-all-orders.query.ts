export class GetAllOrdersQuery {
  constructor(
    public readonly pageNumber?: number,
    public readonly pageSize?: number,
  ) {}
}

