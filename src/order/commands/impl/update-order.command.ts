import { UpdateOrderDto } from '../../dto/update-order.dto';

export class UpdateOrderCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateOrderDto,
  ) {}
}

