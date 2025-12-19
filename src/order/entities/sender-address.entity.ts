import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('sender_addresses')
export class SenderAddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'mobile_no' })
  mobileNo: string;

  @Column({ name: 'address_line1' })
  addressLine1: string;

  @Column({ name: 'address_line2', nullable: true })
  addressLine2: string;

  @Column({ name: 'city_name', nullable: true })
  cityName: string;

  @Column({ name: 'country_name', nullable: true })
  countryName: string;

  @Column({ name: 'country_code', length: 2, nullable: true })
  countryCode: string;

  @Column({ name: 'zip_code', nullable: true })
  zipCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: string;

  @Column({ name: 'order_id', unique: true })
  orderId: string;

  @OneToOne(() => OrderEntity, (order) => order.senderAddress)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

