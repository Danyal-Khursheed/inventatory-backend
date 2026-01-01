import { SubmitOrderDto } from '../../dto/submit-order.dto';

export class SubmitOrderCommand {
  constructor(public readonly dto: SubmitOrderDto) {}
}

