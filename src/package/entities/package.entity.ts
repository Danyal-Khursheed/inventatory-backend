import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('packages')
export class PackageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  item: string;

  @Column('int')
  size: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  color: string;

  @Column('varchar')
  @Index()
  sku: string;

  @Column('int')
  quantity: number;

  @Column('varchar')
  @Index()
  upc: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
