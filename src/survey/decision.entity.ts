import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Survey } from './survey.entity';
import { Question } from '../form/question.entity';
import { Answer } from '../form/answer.entity';
import {Auditable} from "../backoffice/auditable.entity";

@Entity()
export class Decision extends Auditable{
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'ID único de la decisión', example: 1 })
    id: number;

    @ManyToOne(() => Survey, { eager: true })
    @ApiProperty({ description: 'Encuesta a la que pertenece la decisión', type: () => Survey })
    survey: Survey;

    @ManyToOne(() => Question, { eager: true })
    @ApiProperty({ description: 'Pregunta que se respondió en la decisión', type: () => Question })
    question: Question;

    @ManyToOne(() => Answer, { eager: true, nullable: true })
    @ApiProperty({ description: 'Respuesta elegida por el encuestado', type: () => Answer })
    answer: Answer;

    @Column('varchar', { length: 255 })
    @ApiProperty({ description: 'Coordenadas del mouse antes de tomar la respuesta', example: '(120,340),(121,340)' })
    mouseCoordinates: string;

    @Column('int')
    @ApiProperty({ description: 'Tiempo que tardó el encuestado en decidir por la respuesta, en segundos', example: 15 })
    decisionTime: number;
}
