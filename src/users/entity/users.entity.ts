import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyName: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  refreshToken: string;
}
