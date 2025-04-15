import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Group } from '../entities/group.entity';

@Entity('vehicles')
export class Vehicle {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 100 })
    brand!: string;

    @Column({ type: 'varchar', length: 100 })
    model!: string;

    @Column({ type: 'int' })
    year!: number;

    @Column({ type: 'varchar', length: 50 })
    color!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    location!: string;

    @ManyToMany(() => Group, group => group.vehicles)
    @JoinTable({
        name: 'vehicle_groups',
        joinColumn: { name: 'vehicle_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'group_id', referencedColumnName: 'id' }
    })
    groups!: Group[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}