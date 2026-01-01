import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WarehouseItemEntity } from '../../warehouse-item/entities/warehouse-item.entity';
import { CompanyOrigin } from '../../companies_origin_management/entity/companies.entity';
import { PickupAddressEntity } from '../../pickup-address/entities/pickup-address.entity';
import { ShippingCompanyEntity } from '../../shipping-company/entities/shipping-company.entity';

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

  @Column({ name: 'country_origin_id', nullable: true })
  countryOriginId: string;

  @ManyToOne(() => CompanyOrigin, (countryOrigin) => countryOrigin.warehouses, {
    nullable: true,
  })
  @JoinColumn({ name: 'country_origin_id' })
  countryOrigin: CompanyOrigin;

  @OneToMany(() => CompanyOrigin, (countryOrigin) => countryOrigin.warehouse)
  countryOrigins: CompanyOrigin[];

  @OneToMany(() => WarehouseItemEntity, (warehouseItem) => warehouseItem.warehouse)
  warehouseItems: WarehouseItemEntity[];

  @OneToMany(() => PickupAddressEntity, (pickupAddress) => pickupAddress.warehouse)
  pickupAddresses: PickupAddressEntity[];

  @OneToMany(() => ShippingCompanyEntity, (shippingCompany) => shippingCompany.warehouse)
  shippingCompanies: ShippingCompanyEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

