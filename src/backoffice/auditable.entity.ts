import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {Exclude} from "class-transformer";

export abstract class Auditable {
    @Exclude()
    @Column('boolean', { default: false })
    @ApiProperty({ description: 'Indica si el registro ha sido eliminado', example: false })
    deleted: boolean;


    @Exclude()
    @CreateDateColumn()
    @ApiProperty({ description: 'Fecha de creación del registro', example: '2024-11-10T14:48:00.000Z' })
    createdDate: Date;

    @Exclude()
    @UpdateDateColumn()
    @ApiProperty({ description: 'Fecha de la última modificación del registro', example: '2024-11-11T09:22:00.000Z' })
    modifiedDate: Date;

}
