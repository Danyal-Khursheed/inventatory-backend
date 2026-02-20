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
import { ProductCategory } from '../enums/product-category.enum';

@Entity('warehouse_items')
export class WarehouseItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  upc: string;

  @Column({ name: 'price_per_item', type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerItem: number;

  @Column({ name: 'weight_per_item', type: 'decimal', precision: 10, scale: 2, nullable: true })
  weightPerItem: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({
    name: 'product_category',
    type: 'enum',
    enum: ProductCategory,
    nullable: true,
  })
  productCategory: ProductCategory | null;

  @Column({ name: 'retrnxbox_damaged', type: 'int', default: 0 })
  retrnxboxDamaged: number;

  @ManyToOne(() => WarehouseEntity, (warehouse) => warehouse.warehouseItems)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: WarehouseEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

