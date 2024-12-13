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

    @ManyToOne(() => Survey, )
    @ApiProperty({ description: 'Encuesta a la que pertenece la decisión', type: () => Survey })
    survey: Survey;

    @ManyToOne(() => Question, )
    @ApiProperty({ description: 'Pregunta que se respondió en la decisión', type: () => Question })
    question: Question;

    @ManyToOne(() => Answer, {  nullable: true })
    @ApiProperty({ description: 'Respuesta elegida por el encuestado', type: () => Answer })
    answer: Answer;

    @Column('json')
    @ApiProperty({
        description: 'Coordenadas del mouse como un array de puntos',
        example: '[{"x": 120, "y": 340}, {"x": 121, "y": 341}]'
    })
    mouseCoordinates: { x: number; y: number }[];

    @Column('int')
    @ApiProperty({ description: 'Tiempo que tardó el encuestado en decidir por la respuesta, en miliSegundos', example: 2505  })
    decisionTime: number;
}
