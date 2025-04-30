import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { RolesEntity } from './create-role.entity';
import { PermissionEntity } from 'src/permissions-management/entity/permissions.entity';

@Entity('role_permissions')
export class RolePermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RolesEntity, (role) => role.rolePermissions, {
    onDelete: 'CASCADE',
  })
  role: RolesEntity;

  @ManyToOne(() => PermissionEntity, { eager: true, onDelete: 'CASCADE' })
  permission: PermissionEntity;

  @Column('text', { array: true, default: [] })
  actions: string[];
}
