import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WarehouseEntity } from '../../warehouse/entities/warehouse.entity';

@Entity('shipping_companies')
export class ShippingCompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'service_name' })
  serviceName: string;

  @Column({ name: 'service_type' })
  serviceType: string;

  @Column({ name: 'warehouse_id', nullable: true })
  warehouseId: string;

  @ManyToOne(() => WarehouseEntity, (warehouse) => warehouse.shippingCompanies)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: WarehouseEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

