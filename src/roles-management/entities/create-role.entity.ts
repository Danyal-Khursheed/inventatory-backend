import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('roles')
export class RolesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roleName: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
