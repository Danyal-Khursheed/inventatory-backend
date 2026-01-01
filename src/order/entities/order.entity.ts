import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ShippingCompanyEntity } from '../../shipping-company/entities/shipping-company.entity';
import { WarehouseEntity } from '../../warehouse/entities/warehouse.entity';
import { CompanyOrigin } from '../../companies_origin_management/entity/companies.entity';
import { PickupAddressEntity } from '../../pickup-address/entities/pickup-address.entity';
import { OrderItemEntity } from './order-item.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @ManyToOne(() => WarehouseEntity)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: WarehouseEntity;

  @Column({ name: 'country_origin_id' })
  countryOriginId: string;

  @ManyToOne(() => CompanyOrigin)
  @JoinColumn({ name: 'country_origin_id' })
  countryOrigin: CompanyOrigin;

  @Column({ name: 'pickup_address_id' })
  pickupAddressId: string;

  @ManyToOne(() => PickupAddressEntity)
  @JoinColumn({ name: 'pickup_address_id' })
  pickupAddress: PickupAddressEntity;

  @Column({ name: 'shipping_company_id', nullable: true })
  shippingCompanyId: string;

  @ManyToOne(() => ShippingCompanyEntity, { nullable: true })
  @JoinColumn({ name: 'shipping_company_id' })
  shippingCompany: ShippingCompanyEntity;

  @Column({ name: 'quantity_ordered', type: 'int' })
  quantityOrdered: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ name: 'total_weight', type: 'decimal', precision: 10, scale: 2 })
  totalWeight: number;

  @Column({ name: 'order_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate: Date;

  @Column({ name: 'order_status', default: 'pending' })
  orderStatus: string;

  @Column({ name: 'payment_status', default: 'pending' })
  paymentStatus: string;

  @Column({ name: 'delivery_date', type: 'timestamp', nullable: true })
  deliveryDate: Date | null;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, {
    cascade: true,
  })
  orderItems: OrderItemEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
