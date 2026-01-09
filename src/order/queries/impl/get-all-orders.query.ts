export class GetAllOrdersQuery {
  constructor(
    public readonly pageNumber?: number,
    public readonly pageSize?: number,
    public readonly orderStatus?: string,
    public readonly paymentStatus?: string,
  ) {}
}

