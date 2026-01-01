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

@Entity('pickup_addresses')
export class PickupAddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'address_nick' })
  addressNick: string;

  @Column()
  address: string;

  @Column({ name: 'zip_code', nullable: true })
  zipCode: string;

  @Column({ name: 'mobile_no', length: 20 })
  mobileNo: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: string;

  @Column({ name: 'city_name' })
  cityName: string;

  @Column({ name: 'country_name' })
  countryName: string;

  @Column({ name: 'country_code', length: 2 })
  countryCode: string;

  @Column({ name: 'warehouse_id', nullable: true })
  warehouseId: string;

  @ManyToOne(() => WarehouseEntity, (warehouse) => warehouse.pickupAddresses)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: WarehouseEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

