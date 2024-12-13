import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Career } from './career.entity';
import {Auditable} from "../backoffice/auditable.entity";

@Entity()
export class Respondent extends Auditable{
    @PrimaryColumn('int')  // Marcar `ci` como clave primaria
    @ApiProperty({
        description: 'Número de cédula de identidad del encuestado, clave primaria',
        example: 12345678,
    })
    ci: number;


    @Column('varchar', { length: 255 })
    @ApiProperty({
        description: 'Nombre del encuestado',
        example: 'John',
    })
    name: string;

    @Column('varchar', { length: 255 })
    @ApiProperty({
        description: 'Apellido del encuestado',
        example: 'Doe',
    })
    surname: string;

    @Column('int')
    @ApiProperty({
        description: 'Edad del encuestado',
        example: 30,
    })
    age: number;

    @ManyToOne(() => Career, (career) => career.respondents,{ eager: false })
    @ApiProperty({
        description: 'Carrera asociada al encuestado, que describe su profesión o campo de estudio',
        type: () => Career,
    })
    career: Career;
}
