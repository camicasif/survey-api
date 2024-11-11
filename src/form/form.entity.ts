import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Question } from './question.entity';
import {Auditable} from "../backoffice/auditable.entity";

@Entity()
export class Form extends Auditable{
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: 'ID único generado automáticamente para el formulario',
        example: 1,
    })
    id: number;

    @Column('varchar', { length: 255 })
    @ApiProperty({
        description: 'Título del formulario',
        example: 'Encuesta de Satisfacción',
    })
    title: string;

    @Column('text')
    @ApiProperty({
        description: 'Descripción del formulario',
        example: 'Formulario para medir la satisfacción del cliente',
    })
    description: string;

    @Column('boolean', { default: true })
    @ApiProperty({
        description: 'Indica si el formulario está abierto para ser respondido',
        example: true,
    })
    isOpen: boolean;

    @Column('int', { default: 0 })
    @ApiProperty({
        description: 'Número de veces que el formulario ha sido tomado por los encuestados',
        example: 25,
    })
    nTimesTaken: number;

    @OneToMany(() => Question, (question) => question.form)
    @ApiProperty({
        description: 'Lista de preguntas asociadas al formulario',
        type: () => [Question],
    })
    questions: Question[];
}
