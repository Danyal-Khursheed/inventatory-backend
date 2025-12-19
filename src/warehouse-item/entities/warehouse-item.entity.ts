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

@Entity('warehouse_items')
export class WarehouseItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  weight: number;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @ManyToOne(() => WarehouseEntity, (warehouse) => warehouse.warehouseItems)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: WarehouseEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

