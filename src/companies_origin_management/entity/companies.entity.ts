import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CountryEntity } from '../../country/entities/country.entity';
import { WarehouseEntity } from '../../warehouse/entities/warehouse.entity';

@Entity('companies_origin')
export class CompanyOrigin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'address_nick' })
  addressNick: string;

  @Column({ name: 'address_line1' })
  addressLine1: string;

  @Column({ name: 'city_name' })
  cityName: string;

  @Column({ name: 'country_name' })
  countryName: string;

  @Column({ name: 'country_code', length: 2 })
  countryCode: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: string;

  @Column({ name: 'phone_code', length: 5 })
  phoneCode: string;

  @Column({ name: 'phone_number', length: 20 })
  mobileNo: string;

  @Column({ name: 'country_id', nullable: true })
  countryId: string;

  @ManyToOne(() => CountryEntity, { nullable: true })
  @JoinColumn({ name: 'country_id' })
  country: CountryEntity;

  @Column({ name: 'warehouse_id', nullable: true })
  warehouseId: string;

  @ManyToOne(() => WarehouseEntity, (warehouse) => warehouse.countryOrigins)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: WarehouseEntity;

  @OneToMany(() => WarehouseEntity, (warehouse) => warehouse.countryOrigin)
  warehouses: WarehouseEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
