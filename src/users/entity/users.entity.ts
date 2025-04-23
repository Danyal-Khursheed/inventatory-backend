import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column()
    userName: string;

    @Column()
    email: string;
}