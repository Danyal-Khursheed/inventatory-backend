import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
