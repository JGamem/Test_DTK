import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('groups')
export class Group {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @ManyToMany(() => Vehicle, vehicle => vehicle.groups)
    vehicles!: Vehicle[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}