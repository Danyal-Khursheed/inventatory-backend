import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { WarehouseItemEntity } from '../../warehouse-item/entities/warehouse-item.entity';
import { PickupAddressEntity } from '../../pickup-address/entities/pickup-address.entity';
import { ShippingCompanyEntity } from '../../shipping-company/entities/shipping-company.entity';
import { CompanyOrigin } from '../../companies_origin_management/entity/companies.entity';

@Entity('warehouses')
export class WarehouseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ name: 'country_name', nullable: true })
  countryName: string;

  @Column({ name: 'country_code', length: 2, nullable: true })
  countryCode: string;

  @OneToMany(() => WarehouseItemEntity, (warehouseItem) => warehouseItem.warehouse,{cascade:true})
  warehouseItems: WarehouseItemEntity[];

  @OneToMany(() => PickupAddressEntity, (pickupAddress) => pickupAddress.warehouse,{cascade:true})
  pickupAddresses: PickupAddressEntity[];

  @OneToMany(() => ShippingCompanyEntity, (shippingCompany) => shippingCompany.warehouse,{cascade:true})
  shippingCompanies: ShippingCompanyEntity[];

  @OneToMany(() => CompanyOrigin, (countryOrigin) => countryOrigin.warehouse ,{cascade:true})
  countryOrigins: CompanyOrigin[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

