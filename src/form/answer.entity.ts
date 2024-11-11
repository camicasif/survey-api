import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Question } from './question.entity';
import {Auditable} from "../backoffice/auditable.entity";

@Entity()
export class Answer extends Auditable{
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: 'ID único generado automáticamente para la respuesta',
        example: 1,
    })
    id: number;

    @Column('text')
    @ApiProperty({
        description: 'Descripción o contenido de la respuesta',
        example: 'Muy satisfecho',
    })
    description: string;

    @ManyToOne(() => Question, (question) => question.answers)
    @ApiProperty({
        description: 'Pregunta a la que pertenece la respuesta',
        type: () => Question,
    })
    question: Question;
}
