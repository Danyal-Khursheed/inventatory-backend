export class GetAllWarehouseItemsQuery {
  constructor(
    public readonly warehouseId?: string,
    public readonly pageNumber?: number,
    public readonly pageSize?: number,
  ) {}
}

