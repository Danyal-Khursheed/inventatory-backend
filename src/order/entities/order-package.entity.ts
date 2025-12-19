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
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';

@Entity('order_packages')
export class OrderPackageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  length: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  width: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  height: number;

  @Column({ name: 'is_document', type: 'boolean', default: false })
  isDocument: boolean;

  @Column({ name: 'dead_weight', type: 'decimal', precision: 10, scale: 2 })
  deadWeight: number;

  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => OrderEntity, (order) => order.packages)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.orderPackage, {
    cascade: true,
  })
  items: OrderItemEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

