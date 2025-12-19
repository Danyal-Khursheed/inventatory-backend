import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ShippingCompanyEntity } from '../../shipping-company/entities/shipping-company.entity';
import { OrderPackageEntity } from './order-package.entity';
import { ReceiverEntity } from './receiver.entity';
import { SenderEntity } from './sender.entity';
import { SenderAddressEntity } from './sender-address.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  hash: string;

  @Column({ name: 'service_name' })
  serviceName: string;

  @Column({ name: 'service_type' })
  serviceType: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'order_total', type: 'decimal', precision: 10, scale: 2 })
  orderTotal: number;

  @Column({ name: 'payment_currency', length: 3 })
  paymentCurrency: string;

  @Column({ name: 'payment_method' })
  paymentMethod: string;

  @Column({ name: 'preferred_date', type: 'date', nullable: true })
  preferredDate: Date | null;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string;

  @Column({ name: 'shipping_company_id', nullable: true })
  shippingCompanyId: string;

  @ManyToOne(() => ShippingCompanyEntity, { nullable: true })
  @JoinColumn({ name: 'shipping_company_id' })
  shippingCompany: ShippingCompanyEntity;

  @OneToMany(() => OrderPackageEntity, (orderPackage) => orderPackage.order)
  packages: OrderPackageEntity[];

  @OneToOne(() => ReceiverEntity, (receiver) => receiver.order, {
    cascade: true,
  })
  receiver: ReceiverEntity;

  @OneToOne(() => SenderEntity, (sender) => sender.order, { cascade: true })
  sender: SenderEntity;

  @OneToOne(() => SenderAddressEntity, (senderAddress) => senderAddress.order, {
    cascade: true,
  })
  senderAddress: SenderAddressEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

