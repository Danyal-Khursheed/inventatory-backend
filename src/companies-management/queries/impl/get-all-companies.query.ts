export class GetAllCompnaiesQuery {
  constructor(
    public readonly id: string,
    public readonly role: string,
    public readonly pageNumber?: number,
    public readonly pageSize?: number,
    public readonly searchTerm?: string,
  ) {}
}
