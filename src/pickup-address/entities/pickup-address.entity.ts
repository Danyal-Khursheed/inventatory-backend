import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pickup_addresses')
export class PickupAddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'address_nick' })
  addressNick: string;

  @Column({ name: 'address_line1' })
  addressLine1: string;

  @Column({ name: 'address_line2', nullable: true })
  addressLine2: string;

  @Column({ name: 'zip_code', nullable: true })
  zipCode: string;

  @Column({ name: 'phone_code', length: 5 })
  phoneCode: string;

  @Column({ name: 'mobile_no', length: 20 })
  mobileNo: string;

  @Column({ name: 'is_default', type: 'int', default: 0 })
  isDefault: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: string;

  @Column({ name: 'pickup_data', type: 'text', nullable: true })
  pickupData: string | null;

  @Column()
  hash: string;

  @Column({ name: 'city_name' })
  cityName: string;

  @Column({ name: 'country_name' })
  countryName: string;

  @Column({ name: 'country_code', length: 2 })
  countryCode: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

